const ExchangeRate = require('db/models/ExchangeRate');
const Order = require('db/models/Order');
const User = require('db/models/User');
const log = require('lib/log');
const redis = require('redis');

const generalPublisher = redis.createClient();

module.exports = (() => {
  let syncTimeoutId = null;
  let currentExchangeRates = [];

  const makeUserTransaction = async (userId, currencyPair, amount, price, sell) => {
    let [ base, target ] = currencyPair.split('_');

    console.log(base, target);

    // mock USDT to USD
    base = base === 'USDT' ? 'USD' : base;
    target = target === 'USDT' ? 'USD' : target;

    // buying
    /*
      1. Target ⬆️ amount
      2. WalletOnOrder[Base]: ⬇️ amount * price
    */

    // selling
    /*
      1. WalletOnOrder[Target] ⬇️ amount
      2. Base ⬆️ amount * price
    */
    
    const totalPrice = amount * price;

    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        log.error(`${userId} does not exist.`);
        return;
      }

      if (!sell && user.wallet[target] === undefined) {
        // if wallet target is undefined, directly set the target value
        return User.findByIdAndUpdate(userId, {
          $set: {
            [`wallet.${target}`]: amount
          },
          $inc: {
            [`walletOnOrder.${base}`]: totalPrice * -1
          }
        }).exec();
      }
      
      if (!sell) {
        return User.findByIdAndUpdate(userId, {
          $inc: {
            [`wallet.${target}`]: amount,
            [`walletOnOrder.${base}`]: totalPrice * -1
          }
        }).exec();
      } else {
        return User.findByIdAndUpdate(userId, {
          $inc: {
            [`wallet.${base}`]: totalPrice,
            [`walletOnOrder.${target}`]: amount * -1
          }
        }).exec();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const refreshExchangeRates = () => {
    return ExchangeRate.find({
    }, {
      name: true,
      last: true,
      baseVolume: true
    }).lean().exec();
  };

  const syncExchangeRate = async () => {
    try {
      currentExchangeRates = await refreshExchangeRates();
      await loopThroughCoins();
    } catch (e) {
      console.log(e);
    }
    syncTimeoutId = setTimeout(syncExchangeRate, 1000);
  };

  const findAvailableOrders = (rateInfo, sell) => {
    return Order.find({
      status: 'waiting',
      currencyPair: rateInfo.name,
      price: {
        [sell ? '$lte' : '$gte']: rateInfo.last
      },
      sell
    }).lean().exec();
  };

  const processOrder = async (order) => {
    const { _id, amount, userId, price, currencyPair, sell } = order;
    try {
      await Order.findByIdAndUpdate(_id, { 
        status: 'processed',
        $inc: {
          processedAmount: amount
        }
      }).exec();
      await makeUserTransaction(userId, currencyPair, amount, price, sell);
      generalPublisher.publish('general', JSON.stringify({
        type: 'ORDER_PROCESSED',
        payload: order
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const loopThroughCoins = async () => {
    let availableOrders = [];
    
    const findBuyOrders = currentExchangeRates.map(
      (rateInfo) => findAvailableOrders(rateInfo, false)
    );

    const buyOrders = await Promise.all(findBuyOrders);

    buyOrders.forEach(orders => {
      if (orders.length > 0) {
        availableOrders = availableOrders.concat(orders);
      }
    });

    const findSellOrders = currentExchangeRates.map(
      (rateInfo) => findAvailableOrders(rateInfo, true)
    );

    const sellOrders = await Promise.all(findSellOrders);

    sellOrders.forEach(orders => {
      if (orders.length > 0) {
        availableOrders = availableOrders.concat(orders);
      }
    });

    availableOrders.map((order) => {
      processOrder(order);
    });
  };

  return {
    beginSync() {
      syncExchangeRate();
      log.info('sync began');
    },
    endSync() {
      clearTimeout(syncTimeoutId);
      syncTimeoutId = null;
    }
  };
})();
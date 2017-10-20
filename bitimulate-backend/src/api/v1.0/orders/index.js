const Router = require('koa-router');

const orders = new Router();
const ordersCtrl = require('./orders.ctrl');
const needAuth = require('lib/middlewares/needAuth');

orders.post('/', ordersCtrl.createOrder);
orders.post('/:id/cancel', needAuth, ordersCtrl.cancelOrder);

module.exports = orders;
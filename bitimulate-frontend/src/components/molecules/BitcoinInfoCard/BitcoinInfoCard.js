import React, { Component } from 'react';
import styles from './BitcoinInfoCard.scss';
import classNames from 'classnames/bind';
import { HoverCard } from 'components';
// import { getCurrency } from 'lib/utils';
import { withRouter } from 'react-router'
import { scrollTo } from 'lib/utils';


const cx = classNames.bind(styles);

class BitcoinInfoCard extends Component {

  state = {
    highlight: false,
    greater: true
  }

  timeoutId = null;

  handleOpenCurrency = () => {
    const { history } = this.props;
    history.push(`/trade/BTC`);
    scrollTo(0);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.info !== nextProps.info
  }

  highlight = (greater) => {
    this.setState({
      highlight: true,
      greater
    });

    this.timeoutId = setTimeout(() => {
      this.setState({
        highlight: false
      });
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.last !== this.props.last) {
      this.highlight(this.props.last > prevProps.last);
    }
  }  

  render() {
    const {
      currencyKey="ETH", 
      last=4.7e-7, 
      // volume="125543", 
      percentage="0.01", 
      currencyName="Ethereum", 
      // onTogglePin, 
      // pinned
    } = this.props;
    const { highlight, greater } = this.state;
    const { handleOpenCurrency } = this;

    if(!currencyName) return null;
    if(currencyKey === 'BTC') return null;
    
      const parsedPercentage = Math.round(parseFloat(percentage) * 10000) / 100;
      const value = last.toFixed(2);
    
      return (
        <div className={cx('wrapper')}>
          <HoverCard className={cx('bitcoin-info-card', highlight && (greater ? 'green' : 'red'))} onClick={handleOpenCurrency}>
            <div className={cx('bitcoin')}>
              BTC
            </div>
            <div className={cx('percentage')}>({parsedPercentage}%)</div>
            <div className={cx('value')}>${value}</div>
            <div className={cx('name')}>Bitcoin</div>
          </HoverCard>
        </div>
      );

  }
}

export default withRouter(BitcoinInfoCard);
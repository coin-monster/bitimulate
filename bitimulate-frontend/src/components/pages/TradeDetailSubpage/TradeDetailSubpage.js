import React, { Component } from 'react';
// import styles from './TradeDetailSubpage.scss';
// import classNames from 'classnames/bind';
import { TradeChartContainer, OrderBookContainer, TradeSectionContainer } from 'containers';

// const cx = classNames.bind(styles);

class TradeDetailSubpage extends Component { 
  scrollToTop = () => {
    document.documentElement.scrollTop = 0;
  }
  componentDidMount() {
    this.scrollToTop();
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.match.params.currencyKey !== this.props.match.params.currencyKey) {
      this.scrollToTop();
    }
  }
  
  
  render() {
    const { currencyKey } = this.props.match.params;

    return (
      <div>
        <TradeChartContainer currencyKey={currencyKey}/>
        <TradeSectionContainer/>
        <OrderBookContainer/>
      </div>
    );
  }
}


export default TradeDetailSubpage;
import React, { Component } from 'react';
import styles from './RateInfoCard.scss';
import classNames from 'classnames/bind';
import { HoverCard } from 'components';
import PinIcon from 'react-icons/lib/ti/pin';
import { getCurrency } from 'lib/utils';

const cx = classNames.bind(styles);

class RateInfoCard extends Component {

  state = {
    highlight: false,
    greater: true
  }

  timeoutId = null;

  componentWillUnmount() {
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.info !== nextProps.info
          || this.props.pinned !== nextProps.pinned
          || this.state.highlight !== nextState.highlight
          || this.state.greater !== nextState.greater
  }

  highlight = (greater) => {
    console.log('highlighting..', greater, this.props.currencyName);
    this.setState({
      highlight: true,
      greater
    });

    setTimeout(() => {
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
      volume="125543", 
      percentage="0.01", 
      currencyName="Ethereum", 
      onTogglePin, 
      pinned
    } = this.props;
    const { highlight, greater } = this.state;

    if(!currencyName) return null;
    
      const parsedPercentage = Math.round(parseFloat(percentage) * 10000) / 100;
      const parsedVolume = Math.round(parseFloat(volume) * 100) / 100;
      const value = last.toFixed(9);
    
      return (
        <div className={cx('wrapper')}>
          <HoverCard className={cx('rate-info-card', highlight && (greater ? 'green' : 'red'))}>
            <div className={cx('head')}>
              <div className={cx('short-name')}>{currencyKey}</div>
              <div className={cx('pin-wrapper', { active: pinned })}><PinIcon onClick={onTogglePin}/></div>
            </div>
            <div className={cx('percentage', { positive: parsedPercentage > 0, netural: parsedPercentage === 0 })}>({parsedPercentage.toFixed(2)}%)</div>
            <div className={cx('value')}>{value}</div>
            <div className={cx('name')}>{currencyName}</div>
            <div className={cx('volume')}>
              <b>Volume </b>
              <span>{parsedVolume}</span>
            </div>
          </HoverCard>
        </div>
      );

  }
}

export default RateInfoCard;
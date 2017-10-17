import React, { Component } from 'react';
// import styles from './InitialMoneyOptions.scss';
// import classNames from 'classnames/bind';
import { Option } from 'components';
import { optionsPerCurrency } from 'lib/variables';
// const cx = classNames.bind(styles);


class InitialMoneyOptions extends Component {
  render() {
    const { currency, onSelect, optionIndex } = this.props;

    const info = optionsPerCurrency[currency];
    const options =(() => {
      const multipliers = [1, 10, 100];
      return multipliers.map(
        multiplier => `${info.symbol}${(info.initialValue * multiplier).toLocaleString()}`
      );
    })();

    const optionList = options.map(
      (option, i) => (
        <Option key={option} active={i === optionIndex} onClick={()=>onSelect(i)}>{option}</Option>
      )
    );

    return (
      <div>
        {optionList}
      </div>
    );
  }
};

export default InitialMoneyOptions;
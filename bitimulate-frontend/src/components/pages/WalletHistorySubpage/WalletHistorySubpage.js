import React from 'react';
import styles from './WalletHistorySubpage.scss';
import classNames from 'classnames/bind';
import { WalletHistories } from 'containers';

const cx = classNames.bind(styles);

const WalletHistorySubpage = () => (
  <div className={cx('wallet-history-subpage')}>
    <h1>Trade History</h1>
    <WalletHistories/>
  </div>
);

export default WalletHistorySubpage;
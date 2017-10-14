import React from 'react';
import styles from './SortReverser.scss';
import classNames from 'classnames/bind';
import DescIcon from 'react-icons/lib/fa/sort-amount-desc';

const cx = classNames.bind(styles);

const SortReverser = ({asc, onToggle}) => {
  return (
    <div className={cx('sort-reverser', {asc})} onClick={onToggle}>
      <DescIcon/>
    </div>
  );
};

export default SortReverser;
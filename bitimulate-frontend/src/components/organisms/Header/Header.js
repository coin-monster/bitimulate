import React from 'react';
import styles from './Header.scss';
import classNames from 'classnames/bind';
import { Logo, HeaderNav, Button, UserButton } from 'components';

const cx = classNames.bind(styles);

const Header = ({
  onLoginButtonClick,
  user
}) => {
  return (
    <div className={cx('header')}>
      <div className={cx('responsive')}>
        <div className={cx('logo-wrapper')}>
          <Logo/>
        </div>
        <div className={cx('right-side')}>
          <HeaderNav/>
          {
            user ? (
              <UserButton displayName={user.get('displayName')}/>
            ) : (
              <Button 
                invert 
                className={cx('login-button')}
                onClick={onLoginButtonClick}
              >
                Login
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
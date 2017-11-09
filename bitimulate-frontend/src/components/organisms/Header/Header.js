import React from 'react';
import styles from './Header.scss';
import classNames from 'classnames/bind';
import { Logo, HeaderNav, Button, UserButton, UserMenu, ClickOutside } from 'components';

const cx = classNames.bind(styles);

const Header = ({
  onLoginButtonClick,
  onShowUserMenu,
  onHideUserMenu,
  onLogout,
  userMenu,
  user,
  solid
}) => {
  return (
    <div className={cx('header', { solid })}>
      <div className={cx('responsive')}>
        <div className={cx('logo-wrapper')}>
          <Logo/>
        </div>
        <div className={cx('right-side')}>
          <HeaderNav/>
          {
            user ? (
              <UserButton displayName={user.get('displayName')} onClick={onShowUserMenu}/>
            ) : (
              <Button 
                invert 
                className={cx('login-button')}
                onClick={onLoginButtonClick}>
                Login
              </Button>
            )
          }
        </div>
        <UserMenu visible={userMenu} onHide={onHideUserMenu} eventTypes={["mouseup", "touchend"]} onLogout={onLogout}/>
      </div>
    </div>
  );
};

export default Header;
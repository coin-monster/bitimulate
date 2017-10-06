import { Component } from 'react';
// import redux dependencies
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from 'store/modules/user';
import storage from 'lib/storage';

class UserLoader extends Component {

  checkLoginStatus = async () => {
    const { UserActions } = this.props;
    const user = storage.get('__BTM_USER__');

    if(user) {
      UserActions.setUser(user);
    }

    try {
      await UserActions.checkLoginStatus();
      if (!user || (user && user._id !== this.props.user.get('_id'))) {
        storage.set('__BTM_USER__', this.props.user.toJS());
      }
    } catch (e) {
      storage.remove('__BTM_USER__');
    }
  }
  componentDidMount() {
    this.checkLoginStatus();
  }
  
  render() {
    return null;
  }
}

export default connect(
    (state) => ({
      user: state.user.get('user')
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(UserLoader);
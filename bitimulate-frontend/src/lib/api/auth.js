import axios from 'axios';

export const checkEmail = (email) => axios.get('/api/v1.0/auth/exists/email/' + email);
export const checkDisplayName = (displayName) => axios.get('/api/v1.0/auth/exists/display-name/' + displayName);
export const localRegister = ({
  displayName,
  email,
  password,
  initialMoney: { currency, index }
}) => axios.post('/api/v1.0/auth/register/local', {
  displayName,
  email,
  password,
  initialMoney: { currency, index }
});
export const localLogin = ({email, password}) => axios.post('/api/v1.0/auth/login/local', {
  email, password
});
export const checkLoginStatus =() => axios.get('/api/v1.0/auth/check');
export const logout = () => axios.post('/api/v1.0/auth/logout');

// temporarry logout caller
window.logout = logout;
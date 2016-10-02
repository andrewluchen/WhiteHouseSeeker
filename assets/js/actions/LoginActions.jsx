import AppDispatcher from '../AppDispatcher';
import { LOGIN_USER, LOGOUT_USER } from './ActionConstants';

function loginUser(jwt) {
  let savedJwt = localStorage.getItem('jwt');

  AppDispatcher.dispatch({
    actionType: LOGIN_USER,
    jwt: jwt,
  });

  if (savedJwt !== jwt) {
    localStorage.setItem('jwt', jwt);
  }
}

function logoutUser() {
  localStorage.removeItem('jwt');
  AppDispatcher.dispatch({
    actionType: LOGOUT_USER,
  });
}

export {
  loginUser,
  logoutUser,
}

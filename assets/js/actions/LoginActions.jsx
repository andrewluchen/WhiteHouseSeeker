import AppDispatcher from '../AppDispatcher';
import { LOGIN_USER, LOGOUT_USER } from '../constants/LoginConstants';

export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');

    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
      jwt: jwt,
    });

    if (savedJwt !== jwt) {
      localStorage.setItem('jwt', jwt);
    }
  },

  logoutUser: () => {
    localStorage.removeItem('jwt');
    AppDispatcher.dispatch({
      actionType: LOGOUT_USER,
    });
  }
}

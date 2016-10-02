import {
  LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, REGISTER_FAILURE,
} from '../actions/AuthActions';

function auth(state = {
    isAuthenticated: localStorage.getItem('id_token') ? true : false,
    user: null,
    errorMesage: '',
  }, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        user: action.user,
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.message,
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
      });
    case REGISTER_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.message,
      });
    default:
      return state;
  }
}

export default auth;

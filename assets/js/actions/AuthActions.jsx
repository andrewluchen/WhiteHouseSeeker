import { browserHistory } from 'react-router';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function requestLogin() {
  return {
    type: LOGIN_REQUEST,
  }
}

function receiveLogin(jwt) {
  return {
    type: LOGIN_SUCCESS,
    isAuthenticated: true,
    id_token: jwt,
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    errorMessage: message,
  }
}

export function loginUser(data) {
  return dispatch => {
    $.ajax({
      type: 'POST',
      url: '/auth/login/',
      data: data,
      success: response => {
        let jwt = response.id_token;
        dispatch(receiveLogin(jwt));
        browserHistory.push('/');
      },
      error: function(xhr, status, error) {
        dispatch(loginError(xhr.responseText));
      },
    });
  }
}


export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isAuthenticated: false,
  }
}

function logoutFailure(messaage) {
  return {
    type: LOGOUT_SUCCESS,
    errorMessage: message,
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem('id_token');
    dispatch(receiveLogout());
  }
}


export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

function requestRegister() {
  return {
    type: REGISTER_REQUEST,
  }
}

function receiveRegister() {
  return {
    type: REGISTER_SUCCESS,
  }
}

function registerError(message) {
  return {
    type: REGISTER_FAILURE,
    errorMessage: message,
  }
}

export function registerUser(data) {
  return dispatch => {
    $.ajax({
      type: 'POST',
      url: '/auth/register/',
      data: data,
      success: response => {
        browserHistory.push('/login/');
      },
      error: function(xhr, status, error) {
        dispatch(registerError(xhr.responseText));
      },
    });
  }
}

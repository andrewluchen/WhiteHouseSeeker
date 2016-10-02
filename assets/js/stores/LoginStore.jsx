import jwt_decode from 'jwt-decode';

import AppDispatcher from '../AppDispatcher';
import { LOGIN_USER, LOGOUT_USER } from '../actions/ActionConstants';
import BaseStore from './BaseStore';

class LoginStore extends BaseStore {

  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.registerToActions.bind(this));
    this.user = null;
    this.jwt = null;
  }

  registerToActions(action) {
    switch(action.actionType) {
      case LOGIN_USER:
        this.jwt = action.jwt;
        this.user = jwt_decode(this.jwt);
        this.emitChange();
        break;
      case LOGIN_USER:
        this.user = null;
        this.jwt = null;
      default:
        break;
    };
  }

  getUser() {
    return this._user;
  }

  getJwt() {
    return this._jwt;
  }

}
export default new LoginStore();

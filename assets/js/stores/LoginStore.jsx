import jwt_decode from 'jwt-decode';

import AppDispatcher from '../AppDispatcher';
import { LOGIN_USER, LOGOUT_USER } from '../ActionConstants';
import BaseStore from './BaseStore';

class LoginStore extends BaseStore {

  constructor() {
    super();
    // First we register to the Dispatcher to listen for actions.
    this.dispatchToken = AppDispatcher.register(this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case LOGIN_USER:
        // We get the JWT from the action and save it locally.
        this._jwt = action.jwt;
        // Then we decode it to get the user information.
        this._user = jwt_decode(this._jwt);
        // And we emit a change to all components that are listening.
        // This method is implemented in the `BaseStore`.
        this.emitChange();
        break;
      case LOGIN_USER:
        this._user = null;
        this._jwt = null;
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

import React from 'react';

import { registerUser } from '../actions/AuthActions';

class Login extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let data = {
      username: this.refs.username.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
    }
    registerUser(data);
  }

  render() {
    return (
      <div className="__login">
        <div className="login">
          <div className="login__container">
            <div id="content" className="colM">
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Register
              </div>
              <form id="login-form" onSubmit={this.onSubmit}>
                <div className="form-row">
                  <label className="required" htmlFor="id_username">Username:</label>
                  <input ref="username" id="id_username" maxLength="254" name="username" required="" type="text"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_email">Email:</label>
                  <input ref="email" id="id_email" maxLength="254" name="email" required="" type="email"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_password">Password:</label>
                  <input ref="password" id="id_password" name="password" required="" type="password"/>
                </div>
                <div className="submit-row">
                  <label>&nbsp;</label><input value="Register" type="submit"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

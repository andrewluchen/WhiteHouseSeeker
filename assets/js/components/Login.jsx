import React from 'react';
import { connect } from 'react-redux';

import { loginUser } from '../actions/AuthActions';

class Login extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let data = {
      username: this.refs.username.value,
      password: this.refs.password.value,
    }
    this.props.loginUser(data);
  }

  render() {
    return (
      <div className="login__root">
        <div className="login">
          <div className="login__container">
            <div id="content" className="colM">
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Login
              </div>
              <form id="login-form" onSubmit={this.onSubmit}>
                <div className="form-row">
                  <label className="required" htmlFor="id_username">Username:</label>
                  <input ref="username"  id="id_username" maxLength="254" name="username" required="" type="text"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_password">Password:</label>
                  <input ref="password" id="id_password" name="password" required="" type="password"/>
                </div>
                <div className="submit-row">
                  <label>&nbsp;</label><input value="Log In" type="submit"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    loginUser: data => dispatch(loginUser(data)),
  };
}

export default connect(null, mapDispatchToProps)(Login);

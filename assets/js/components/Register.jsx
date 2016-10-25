import React from 'react';
import { connect } from 'react-redux';

import { registerUser } from '../actions/AuthActions';

class Register extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let password = this.refs.password.value;
    let password2 = this.refs.password2.value;
    if (password !== password2) {
      alert('Passwords do not match!');
      return;
    }
    let data = {
      username: this.refs.username.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
    }
    this.props.registerUser(data);
  }

  render() {
    return (
      <div className="login__root">
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
                <div className="form-row">
                  <label className="required" htmlFor="id_password2">Password (Again):</label>
                  <input ref="password2" id="id_password2" name="password2" required="" type="password"/>
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

Register.propTypes = {
  registerUser: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    registerUser: data => dispatch(registerUser(data)),
  };
}

export default connect(null, mapDispatchToProps)(Register);

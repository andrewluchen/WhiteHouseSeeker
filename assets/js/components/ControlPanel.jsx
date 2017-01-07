import React from 'react';

class ControlPanel extends React.Component {

  constructor() {
    super();
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
  }

  onSubmitPassword(e) {
    e.preventDefault();
    let password = this.refs.password.value;
    let password2 = this.refs.password2.value;
    if (password !== password2) {
      alert('Passwords do not match!');
      return;
    }
    let data = {
      password: this.refs.password.value,
    }
    $.ajax({
      url: '/auth/password/',
      type: 'POST',
      data: data,
      success: response => {
      },
    });
  }

  onSubmitEmail(e) {
    e.preventDefault();
    let data = {
      email: this.refs.email.value,
    }
    $.ajax({
      url: '/auth/email/',
      type: 'POST',
      data: data,
      success: response => {
      },
    });
  }

  render() {
    return (
      <div className="login__root">
        <div className="login">
          <div className="login__container">
            <div id="content" className="colM">
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Change Password
              </div>
              <form id="login-form" onSubmit={this.onSubmitPassword}>
                <div className="form-row">
                  <label className="required" htmlFor="id_password">New Password:</label>
                  <input ref="password" id="id_password" name="password" required="" type="password"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_password2">New Password (again):</label>
                  <input ref="password2" id="id_password2" name="password2" required="" type="password"/>
                </div>
                <div className="submit-row">
                  <label>&nbsp;</label><input value="Change Password" type="submit"/>
                </div>
              </form>
            </div>
            <div id="content" className="colM">
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Change Email
              </div>
              <form id="login-form" onSubmit={this.onSubmitPassword}>
                <div className="form-row">
                  <label className="required" htmlFor="id_email">New Email:</label>
                  <input ref="email" id="id_email" maxLength="254" name="email" required="" type="email"/>
                </div>
                <div className="submit-row">
                  <label>&nbsp;</label><input value="Change Email" type="submit"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlPanel;

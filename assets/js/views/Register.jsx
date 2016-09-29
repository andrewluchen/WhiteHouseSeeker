import React from 'react';

import getCookie from '../getCookie';

class Login extends React.Component {

  render() {
    return (
      <div className="__login">
        <div className="login">
          <div className="login__container">
            <div id="content" className="colM">
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Register
              </div>
              <form action="/auth/register/" method="post" id="login-form">
                <input name="csrfmiddlewaretoken" hidden="true" value={getCookie('csrftoken')}/>
                <div className="form-row">
                  <label className="required" htmlFor="id_username">Username:</label>
                  <input id="id_username" maxLength="254" name="username" required="" type="text"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_email">Email:</label>
                  <input id="id_email" maxLength="254" name="email" required="" type="text"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_password">Password:</label>
                  <input id="id_password" name="password" required="" type="password"/>
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

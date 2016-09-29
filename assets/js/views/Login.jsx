import React from 'react';

import getCookie from '../getCookie';

class Login extends React.Component {

  render() {
    return (
      <div className="__login">
        <div className="login">
          <div className="login__container">
            <div id="content" className="colM">
              <form action="/auth/login/" method="post" id="login-form">
                <input name="csrfmiddlewaretoken" hidden="true" value={getCookie('csrftoken')}/>
                <div className="form-row">
                  <label className="required" htmlFor="id_username">Username:</label>
                  <input id="id_username" maxLength="254" name="username" required="" type="text"/>
                </div>
                <div className="form-row">
                  <label className="required" htmlFor="id_password">Password:</label>
                  <input id="id_password" name="password" required="" type="password"/>
                </div>
                <div className="submit-row">
                  <label>&nbsp;</label><input value="Log in" type="submit"/>
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

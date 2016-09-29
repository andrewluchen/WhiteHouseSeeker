import React from 'react';

class Register extends React.Component {

  render() {
    return (
      <form method="post" id="login-form">
        <div class="form-row">
          <label class="required" for="id_username">Username:</label> <input autofocus="" id="id_username" maxlength="254" name="username" required="" type="text"/>
        </div>
        <div class="form-row">
          <label class="required" for="id_password">Password:</label> <input id="id_password" name="password" required="" type="password"/>
          <input name="next" value="/admin/" type="hidden"/>
        </div>
        <div class="submit-row">
          <label>&nbsp;</label><input value="Log in" type="submit"/>
        </div>
      </form>
    );
  }
}

export default Register;

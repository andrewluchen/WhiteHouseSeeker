import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchCharacters } from '../../actions/CharacterActions';

class Header extends React.Component {
  render() {
    let authenticatedContent = (
      <div className='header-container'>
        <div className='header-notifications'>
          <i className='fa fa-bell'/>
        </div>
        <div className='header-messages'>
          <i className='fa fa-envelope'/>
        </div>
        <div className='header-settings'>
          <i className='fa fa-gear header-settings-gear'/>
        </div>
      </div>
    );
    let logIn = (
      <div>
        <Link to='/register/' className='header-login'>Register</Link>
        {' / '}
        <Link to='/login/' className='header-login'>Login</Link>
      </div>
    );
    return (
      <div className='header'>
        <div className='header-welcome'>
          {this.props.user ? 'Welcome Back ' + this.props.user.username + '!' : null}
        </div>
        {this.props.user ? authenticatedContent : logIn}
      </div>
    );
  }
}

Header.propTypes = {
  user: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(Header);

import React from 'react';
import { Link } from 'react-router';

import { fetchCharacters } from '../../actions/CharacterActions';
import CharacterStore from '../../stores/CharacterStore';
import LoginStore from '../../stores/LoginStore';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      user: LoginStore.getUser(),
      character: CharacterStore.getActive(),
      availableCharacters: CharacterStore.getCharacters(),
    }
  }

  componentDidMount() {
    this.changeListener = this.onChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
    CharacterStore.addChangeListener(this.changeListener);
    fetchCharacters();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
    CharacterStore.removeChangeListener(this.changeListener);
  }

  onChange() {
    this.setState({
      user: LoginStore.getUser(),
      character: CharacterStore.getActive(),
      availableCharacters: CharacterStore.getCharacters(),
    });
  }

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
          {this.state.user ? 'Welcome Back ' + this.state.user.username + '!' : null}
        </div>
        {this.state.user ? authenticatedContent : logIn}
      </div>
    );
  }
}

export default Header;

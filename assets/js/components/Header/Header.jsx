import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import { toggleLayout } from '../../actions/LayoutActions';
import { setPrimaryCharacter } from '../../actions/CharacterActions';

import CharacterSelector from '../Character/CharacterSelector';

class Header extends React.Component {

  onLogout() {
    window.location = '/auth/logout/';
  }

  render() {
    let authenticatedContent = (
      <div className='topbar-icons'>
        <div className='topbar-title'>
          <i className='fa fa-bell'/>&nbsp;
        </div>
        <div className='topbar-title'>
          <i className='fa fa-envelope'/>&nbsp;
        </div>
        <IconMenu
          className='topbar-settings'
          iconButtonElement={<IconButton><i className='fa fa-ellipsis-v'/></IconButton>}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          onChange={this.onLogout}
        >
          <MenuItem value='logout' primaryText='Logout'/>
        </IconMenu>
      </div>
    );
    let logIn = (
      <div className='topbar-title topbar-authentication'>
        <Link to='/register/' className='topbar-register'>Register</Link>
        &nbsp;/&nbsp;
        <Link to='/login/' className='topbar-login'>Login</Link>
      </div>
    );
    let characters = (
      <div className='topbar-characters'>
        <div className='topbar-characters-label'>
          You are currently:&nbsp;
        </div>
        <CharacterSelector
          characters={this.props.characters}
          active={this.props.active}
          onSelect={this.props.setPrimaryCharacter}
          newOption={false}
        />
      </div>
    );
    return (
      <AppBar
        title={this.props.user ? 'Welcome Back ' + this.props.user.username + '!' : null}
        onLeftIconButtonTouchTap={() => console.log('hihi')}
        className='topbar'
      >
        <div className='topbar-children'>
          {this.props.user ? characters : <div style={{flex:'1'}}/>}
          {this.props.user ? authenticatedContent : logIn}
        </div>
      </AppBar>
    );
  }
}

Header.propTypes = {
  user: React.PropTypes.object,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
  toggleLayout: React.PropTypes.func,
  setPrimaryCharacter: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    characters: state.characters.characters,
    active: state.characters.active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleLayout: () => dispatch(toggleLayout()),
    setPrimaryCharacter: i => dispatch(setPrimaryCharacter(i)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

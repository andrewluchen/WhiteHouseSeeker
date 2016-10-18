import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

import { setPrimaryCharacter } from '../../actions/CharacterActions';

import CharacterSelector from '../Character/CharacterSelector';

class Header extends React.Component {

  onLogout() {
    window.location = '/auth/logout/';
  }

  render() {
    let authenticatedContent = (
      <ToolbarGroup className='topbar-icons' lastChild={true}>
        <div className='topbar-title'>
          <i className='fa fa-bell'/>&nbsp;
        </div>
        <div className='topbar-title'>
          <i className='fa fa-envelope'/>&nbsp;
        </div>
        <IconMenu
          iconButtonElement={<IconButton><div className='topbar-gear'><i className='fa fa-gear'/>&nbsp;</div></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onChange={this.onLogout}
        >
          <MenuItem value='logout' primaryText='Logout'/>
        </IconMenu>
      </ToolbarGroup>
    );
    let logIn = (
      <ToolbarGroup lastChild={true}>
        <Link to='/register/' className='topbar-title topbar-register'>Register</Link>
        <div className='topbar-title topbar-slash'>/</div>
        <Link to='/login/' className='topbar-title topbar-login'>Login</Link>
      </ToolbarGroup>
    );
    let characters = (
      <ToolbarGroup>
        <div className='topbar-title topbar-characters'>
          <div>You are currently: &nbsp;</div>
          <CharacterSelector
            characters={this.props.characters}
            active={this.props.active}
            onSelect={this.props.setPrimaryCharacter}
            newOption={false}
          />
        </div>
      </ToolbarGroup>
    );
    return (
      <Toolbar className='topbar'>
        <ToolbarGroup className='topbar-welcome'>
          {this.props.user ? <div className='topbar-title'>{'Welcome Back ' + this.props.user.username + '!'}</div> : null}
        </ToolbarGroup>
        {this.props.user ? characters : null}
        {this.props.user ? authenticatedContent : logIn}
      </Toolbar>
    );
  }
}

Header.propTypes = {
  user: React.PropTypes.object,
  characters: React.PropTypes.array,
  active: React.PropTypes.number,
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
    setPrimaryCharacter: i => dispatch(setPrimaryCharacter(i)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

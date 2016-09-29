import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className='header'>
        <div className='header-logo'>
          <div>
            <img src={require('../../../img/logo.png')}/>
          </div>
        </div>
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
  }
}

export default Header;

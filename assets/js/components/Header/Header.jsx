var React = require('react');

class Header extends React.Component {
  render() {
    return (
      <div className='header'>
        <div className='header_logo'>Logo</div>
        <div className='header_notifications'>Notifications</div>
        <div className='header_settings'>Settings</div>
      </div>
    );
  }
}

export default Header;

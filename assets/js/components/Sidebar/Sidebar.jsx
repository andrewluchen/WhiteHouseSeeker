var React = require('react');
var ReactSidebar = require('react-sidebar').default;

class Sidebar extends React.Component {
  render() {
    var sidebar = (
      <div>
        <div>Gen Pop</div>
        <div>Administrativa</div>
          <div>Rules</div>
          <div>Announcement</div>
          <div>Sign-In</div>
        <div>
          <div>National News</div>
          <div>International News</div>
          <div>Press Office</div>
          <div>Social Media</div>
        </div>
        <div>Capitol Hill</div>
        <div>
          <div>US Senate</div>
          <div>US House of Representatives</div>
          <div>White House</div>
          <div>Federal Judiciary</div>
          <div>Library of Congress</div>
        </div>
        <div>Party War Room</div>
      </div>
    );
    return (
      <ReactSidebar
        sidebar={sidebar}
        open={true}
        docked={true}
        {...this.props}
      />
    );
  }
}

export default Sidebar;

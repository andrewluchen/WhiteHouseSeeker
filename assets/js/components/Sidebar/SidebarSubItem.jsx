import React from 'react';
import { Link } from 'react-router';

class SidebarSubItem extends React.Component {
  render() {
    return (
      <div className='sidebar-submenu'>
        <Link to={this.props.link} className='sidebar-link'>
          {this.props.title}
        </Link>
        {this.props.children}
      </div>
    )
  }
}

SidebarSubItem.propTypes = {
  title: React.PropTypes.string,
  link: React.PropTypes.string,
};

export default SidebarSubItem;

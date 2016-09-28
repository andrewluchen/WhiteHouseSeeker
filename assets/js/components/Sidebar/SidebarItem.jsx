import React from 'react';
import { Link } from 'react-router';

class SidebarItem extends React.Component {
  render() {
    return (
      <div className='sidebar-menu'>
        <Link to={this.props.link} className='sidebar link'>
          {this.props.title}
        </Link>
        <div className='sidebar-subitems'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

SidebarItem.propTypes = {
  title: React.PropTypes.string,
  link: React.PropTypes.string,
};

export default SidebarItem;

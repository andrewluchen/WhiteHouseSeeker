import React from 'react';
import { Link } from 'react-router';
import MenuItem from 'material-ui/MenuItem';

class SidebarSubItem extends React.Component {
  render() {
    return (
      <MenuItem>
        <div className='sidebar-subitem'>
          <Link to={this.props.link} className='sidebar-link'>
            {this.props.title}
          </Link>
          {this.props.children}
        </div>
      </MenuItem>
    )
  }
}

SidebarSubItem.propTypes = {
  title: React.PropTypes.string,
  link: React.PropTypes.string,
};

export default SidebarSubItem;

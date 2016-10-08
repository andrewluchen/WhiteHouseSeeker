import React from 'react';
import { Link } from 'react-router';
import MenuItem from 'material-ui/MenuItem';

class SidebarItem extends React.Component {
  render() {
    return (
      <div>
        <MenuItem>
          <div className='sidebar-item'>
            <Link to={this.props.link} className='sidebar-link'>
              {this.props.title}
            </Link>
          </div>
        </MenuItem>
        {this.props.children}
      </div>
    )
  }
}

SidebarItem.propTypes = {
  title: React.PropTypes.string,
  link: React.PropTypes.string,
};

export default SidebarItem;

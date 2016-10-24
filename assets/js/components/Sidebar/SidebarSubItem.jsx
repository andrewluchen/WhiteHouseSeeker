import React from 'react';
import { Link } from 'react-router';
import MenuItem from 'material-ui/MenuItem';

class SidebarSubItem extends React.Component {
  render() {
    return (
      <MenuItem>
        <div className='sidebar-subitem'>
          {
            this.props.noRouter
            ?
            <a href={this.props.link} className='sidebar-link'>
              {this.props.title}
            </a>
            :
            <div>
              <Link to={this.props.link} className='sidebar-link'>
                {this.props.title}
              </Link>
              {this.props.children}
            </div>
          }
        </div>
      </MenuItem>
    )
  }
}

SidebarSubItem.propTypes = {
  title: React.PropTypes.string,
  link: React.PropTypes.string,
  noRouter: React.PropTypes.bool,
};

SidebarSubItem.defaultProps = {
  noRouter: false,
};

export default SidebarSubItem;

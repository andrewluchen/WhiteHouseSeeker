import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

import { toggleSidebar } from '../../actions/LayoutActions';
import SidebarItem from './SidebarItem';
import SidebarSubItem from './SidebarSubItem';

class Sidebar extends React.Component {

  render() {
    return (
      <Drawer
        open={this.props.open}
        docked={this.props.docked}
        onRequestChange={this.props.toggleChange}
      >
        <div className='sidebar-container'>
          <div className='sidebar-header'>
            <div className='sidebar-logo'>
              <Link to='/#'>
                <img src={require('../../../img/logo.png')}/>
              </Link>
            </div>
          </div>
          <div>
            <SidebarItem title='Administrativa' link='#'>
              <SidebarSubItem title='Rules' link='/rules'/>
              <SidebarSubItem title='Announcements' link='/announcements'/>
              <SidebarSubItem title='Character Sign-In' link='/my'/>
            </SidebarItem>
            <SidebarItem title='Search' link='/search'/>
            <SidebarItem title='News' link='/news'>
              <SidebarSubItem title='Mainstream Media' link='/news/admin_news'/>
              <SidebarSubItem title='Fourth Estate' link='/news/player_news'/>
              <SidebarSubItem title='Social Media' link='/news/twitter'/>
              <SidebarSubItem title='Press Relations' link='/news/press'/>
            </SidebarItem>
            <SidebarItem title='Capitol Hill' link='/capitol'>
              <SidebarSubItem title='US Senate' link='/senate'/>
              <SidebarSubItem title='Senate Comittees' link='/senate/committee'/>
              <SidebarSubItem title='US House of Representatives' link='/house'/>
              <SidebarSubItem title='White House' link='/potus'/>
              <SidebarSubItem title='Federal Judiciary' link='/judiciary'/>
              <SidebarSubItem title='Library of Congress' link='/library'/>
            </SidebarItem>
            <SidebarItem title='Party Warroom' link='/forum/' noRouter={true}/>
            <SidebarItem title='Elections' link='/elections'/>
            <SidebarItem title='Minigames' link='/forum/' noRouter={true}/>
            <SidebarItem title='General Discussion' link='/forum/' noRouter={true}/>
            <Divider className='divider'/>
            <SidebarItem title='About' link='/about'/>
          </div>
        </div>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  open: React.PropTypes.bool,
  docked: React.PropTypes.bool,
  toggleChange: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleChange: () => dispatch(toggleSidebar()),
  }
}

export default connect(null, mapDispatchToProps)(Sidebar);

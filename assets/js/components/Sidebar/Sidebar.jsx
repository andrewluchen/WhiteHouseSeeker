import React from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

import SidebarItem from './SidebarItem';
import SidebarSubItem from './SidebarSubItem';

class Sidebar extends React.Component {

  render() {
    return (
      <Drawer open={true}>
        <div className='sidebar-root'>
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
                <SidebarSubItem title='National News' link='/nationalnews'/>
                <SidebarSubItem title='International News' link='/internationalnews'/>
                <SidebarSubItem title='Press Office' link='/pressoffice'/>
                <SidebarSubItem title='Social Media' link='/socialmedia'/>
              </SidebarItem>
              <SidebarItem title='Capitol Hill' link='/capitol'>
                <SidebarSubItem title='US Senate' link='/senate'/>
                <SidebarSubItem title='Senate Comittees' link='/senate/committee'/>
                <SidebarSubItem title='US House of Representatives' link='/house'/>
                <SidebarSubItem title='House Comittees' link='/house/committee'/>
                <SidebarSubItem title='White House' link='/potus'/>
                <SidebarSubItem title='Federal Judiciary' link='/judiciary'/>
                <SidebarSubItem title='Library of Congress' link='/library'/>
              </SidebarItem>
              <SidebarItem title='Elections' link='/elections'>
                <SidebarSubItem title='Presidential' link='/elections/president'/>
                <SidebarSubItem title='Senate' link='/elections/senate'/>
                <SidebarSubItem title='House' link='/elections/house'/>
              </SidebarItem>
              <SidebarItem title='Party Warroom' link='/forum/' noRouter={true}>
                <SidebarSubItem title='Democratic National Committee' link='/forum/' noRouter={true}/>
                <SidebarSubItem title='Republican National Committee' link='/forum/' noRouter={true}/>
                <SidebarItem title='Minigames' link='/forum/' noRouter={true}/>
              </SidebarItem>
              <SidebarItem title='General Discussion' link='/forum/' noRouter={true}/>
              <Divider className='divider'/>
              <SidebarItem title='About' link='/about'/>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default Sidebar;

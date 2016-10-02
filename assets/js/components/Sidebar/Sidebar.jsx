import React from 'react';
import ReactSidebar from 'react-sidebar';

import SidebarItem from './SidebarItem';
import SidebarSubItem from './SidebarSubItem';

class Sidebar extends React.Component {

  render() {
    let sidebarTree = (
      <div className='sidebar-content'>
        <SidebarItem title='Administrativa' link='#'>
          <SidebarSubItem title='Rules' link='/rules'/>
          <SidebarSubItem title='Announcements' link='/announcements'/>
          <SidebarSubItem title='Character Sign-In' link='/my'/>
        </SidebarItem>
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
          <SidebarSubItem title='National' link='/elections/president'/>
          <SidebarSubItem title='Gubernatorial' link='/elections/governor'/>
          <SidebarSubItem title='Congressional' link='/elections/congress'/>
        </SidebarItem>
        <SidebarItem title='Party Warroom' link='/party'>
          <SidebarSubItem title='Democratic National Committee' link='/dnc'/>
          <SidebarSubItem title='Republican National Committee' link='/rnc'/>
        </SidebarItem>
        <SidebarItem title='Minigames' link='/minigames'/>
        <SidebarItem title='General Discussion' link='/genpop'/>
        <div className='divider'/>
        <SidebarItem title='About' link='/about'/>
      </div>
    );

    let sidebar = (
      <div className='sidebar-root'>
        <div className='sidebar-header'>
          <div className='sidebar-logo'>
            <a href='/#'>
              <img src={require('../../../img/logo.png')}/>
            </a>
          </div>
        </div>
        {sidebarTree}
      </div>
    );
    return (
      <ReactSidebar
        sidebar={sidebar}
        open={true}
        docked={true}
        transition={false}
        {...this.props}
      />
    );
  }
}

export default Sidebar;

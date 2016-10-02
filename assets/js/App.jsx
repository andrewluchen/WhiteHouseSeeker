import React from 'react';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

class App extends React.Component {

  componentDidMount() {
    document.title = 'White House Seeker';
  }

  render() {
    return (
      <div>
        <Sidebar>
          <div className='main_container'> 
            <Header/>

            <div className='main_layout'>
              {this.props.children}
            </div>

          </div>
        </Sidebar>
      </div>
    );
  }
}

export default App;

import React from 'react';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

class App extends React.Component {

  render() {
    return (
      <div>
        <Sidebar>
          <Header/>

          <div className='main_layout'>
            {this.props.children}
          </div>

        </Sidebar>
      </div>
    );
  }
}

export default App;

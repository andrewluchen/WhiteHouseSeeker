import React from 'react';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

class App extends React.Component {

  render() {
    return (
      <div>
        <Sidebar>
          <Header/>
          {this.props.children}
        </Sidebar>
      </div>
    );
  }
}

export default App;

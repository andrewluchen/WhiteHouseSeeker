import React from 'react';
import { connect } from 'react-redux';

import { loginJwt } from './actions/AuthActions';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

class App extends React.Component {

  componentWillMount() {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.props.loginJwt(jwt);
    }
  }

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

function mapDispatchToProps(dispatch) {
  return {
    loginJwt: jwt => dispatch(loginJwt(jwt)),
  };
}

export default connect(null, mapDispatchToProps)(App);

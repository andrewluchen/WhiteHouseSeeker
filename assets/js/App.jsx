import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { loginJwt } from './actions/AuthActions';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

class App extends React.Component {

  constructor() {
    super();
    injectTapEventPlugin();
    this.state = {
      mediaWidth: document.documentElement.clientWidth,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.props.loginJwt(jwt);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.title = 'White House Seeker';
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({
      mediaWidth: document.documentElement.clientWidth,
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>

          <Sidebar
            open={this.props.showSidebar}
            docked={this.state.mediaWidth >= 768}
          />

          <div className={'main_container' + (this.props.showSidebar ? ' show-sidebar' : '')}>
            <Header/>
            <div className='main_layout'>
              {this.props.children}
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  showSidebar: React.PropTypes.bool,
  loginJwt: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    showSidebar: state.layout.showSidebar,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginJwt: jwt => dispatch(loginJwt(jwt)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

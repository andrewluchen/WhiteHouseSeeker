import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
require('../sass/style.scss');

const NotFound = () => (<h1>404. This page is not found!</h1>);

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>

          // 404
          <Route path="*" component={NotFound} />

        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

require('../sass/style.scss');

import App from './App';

import About from './views/About';
import Capitol from './views/Capitol';

const NotFound = () => (<h1>404. This page is not found!</h1>);

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>
          <Route path="about" component={About} />
          <Route path="capitol" component={Capitol} />

          // 404
          <Route path="*" component={NotFound} />

        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

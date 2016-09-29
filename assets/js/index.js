import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

require('font-awesome-webpack');
require('../sass/style.scss');

import App from './App';

import newBill from './views/newBill';

import About from './views/About';
import Capitol from './views/Capitol';
import Index from './views/Index';
import Senate from './views/Senate';
import House from './views/House';

const NotFound = () => (<h1>404. This page is not found!</h1>);

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>
          <Route path="/" component={Index} />
          <Route path="about" component={About} />
          <Route path="capitol" component={Capitol} />
          <Route path="senate" component={Senate} />
          <Route path="senate/new" component={newBill('senate')} />
          <Route path="house" component={House} />
          <Route path="house/new" component={newBill('house')} />

          // 404
          <Route path="*" component={NotFound} />

        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

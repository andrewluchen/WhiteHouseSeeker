import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

require('../sass/style.scss');

import App from './App';
import Login from './components/Login';
import Register from './components/Register';

import About from './components/About';
import Capitol from './components/Capitol';
import Index from './components/Index';
import Senate from './components/Senate';
import House from './components/House';
import newBill from './components/newBill';

const NotFound = () => (<h1>404. This page is not found!</h1>);

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}>
          <Route path='/' component={Index} />
          <Route path='/login/' component={Login} />
          <Route path='/register/' component={Register} />

          <Route path='/ic' component={CharacterManagement} />
          <Route path='/capitol' component={Capitol} />
          <Route path='/senate' component={Senate} />
          <Route path='/senate/new' component={newBill('senate')} />
          <Route path='/house' component={House} />
          <Route path='/house/new' component={newBill('house')} />
          <Route path='/about' component={About} />

          // 404
          <Route path='*' component={NotFound} />

        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

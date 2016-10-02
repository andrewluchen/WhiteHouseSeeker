import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux'
import { browserHistory, Router, Route } from 'react-router';
import reduxThunk from 'redux-thunk';

import getCookie from './getCookie';
import reducer from './reducers/reducers';

require('../sass/style.scss');

import App from './App';
import Login from './components/Login';
import Register from './components/Register';

import About from './components/About';
import Capitol from './components/Capitol';
import CharacterManagement from './components/CharacterManagement';
import Index from './components/Index';
import Senate from './components/Senate';
import House from './components/House';
import newBill from './components/newBill';

let store = applyMiddleware(reduxThunk)(createStore)(reducer);

class Root extends React.Component {

  constructor() {
    super();
    $.ajaxPrefilter(function(options, originalOptions, jqXHR){
      jqXHR.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    });
  }

  render() {
    return (
      <Provider store={store}>
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
            <Route path='*' component={() => (<h1>404. This page is not found!</h1>)} />

          </Route>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

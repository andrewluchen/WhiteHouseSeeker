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
import Bill from './components/Bill/Bill';
import BillVersion from './components/Bill/BillVersion';
import Capitol from './components/Capitol';
import Character from './components/Character/Character';
import Debate from './components/Debate/Debate';
import EditBill from './components/Bill/EditBill';
import Index from './components/Index';
import House from './components/House';
import MyCharacters from './components/MyCharacters';
import NewBill from './components/Bill/NewBill';
import NewDebate from './components/Debate/NewDebate';
import NewVote from './components/Vote/NewVote';
import Search from './components/Search';
import Senate from './components/Senate';
import User from './components/User/User';
import Vote from './components/Vote/Vote';
import Wtf from './components/Wtf';

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

            <Route path='/search' component={Search} />
            <Route path='/user/:userId' component={User} />
            <Route path='/my' component={MyCharacters} />
            <Route path='/character/:characterId' component={Character} />
            <Route path='/capitol' component={Capitol} />
            <Route path='/senate' component={Senate} />
            <Route path='/senate/new' component={() => <NewBill chamber='senate'/>} />
            <Route path='/senate/debate/new' component={() => <NewDebate chamber='senate'/>} />
            <Route path='/senate/vote/new' component={() => <NewVote chamber='senate'/>} />
            <Route path='/house' component={House} />
            <Route path='/house/new' component={() => <NewBill chamber='house'/>} />
            <Route path='/house/debate/new' component={() => <NewDebate chamber='house'/>} />
            <Route path='/house/vote/new' component={() => <NewVote chamber='house'/>} />
            <Route path='/bill/:billId' component={Bill} />
            <Route path='/bill/:billId/:versionId' component={BillVersion} />
            <Route path='/bill/:billId/:versionId/edit' component={EditBill} />
            <Route path='/vote/:voteId' component={Vote} />
            <Route path='/debate/:debateId' component={Debate} />
            <Route path='/about' component={About} />
            <Route path='/wtf' component={Wtf} />

            // 404
            <Route path='*' component={() => (<h1>404. This page is not found!</h1>)} />

          </Route>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('container'));

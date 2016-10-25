import { combineReducers } from 'redux';

import authReducer from './authReducer';
import charactersReducer from './charactersReducer';
import layoutReducer from './layoutReducer';

const reducers = combineReducers({
  auth: authReducer,
  characters: charactersReducer,
  layout: layoutReducer,
});

export default reducers;

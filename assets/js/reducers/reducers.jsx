import { combineReducers } from 'redux';

import authReducer from './authReducer';
import characterReducer from './characterReducer';

const reducers = combineReducers({
  auth: authReducer,
  characters: characterReducer,
});

export default reducers;

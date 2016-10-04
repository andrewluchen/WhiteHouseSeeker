import { combineReducers } from 'redux';

import authReducer from './authReducer';
import charactersReducer from './charactersReducer';

const reducers = combineReducers({
  auth: authReducer,
  characters: charactersReducer,
});

export default reducers;

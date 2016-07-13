import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import apiReducer from './api';
import authReducer from './auth';

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  api: apiReducer,
  auth: authReducer,
});

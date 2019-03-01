import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import user from './user'
import auth from './auth'

export default combineReducers({
  routing: routerReducer,
  user,
  auth
})

import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import results from './results'
import searchpage from './searchpage'
import user from './user'
import auth from './auth'

export default combineReducers({
  routing: routerReducer,
  user,
  results,
  searchpage,
  auth
})

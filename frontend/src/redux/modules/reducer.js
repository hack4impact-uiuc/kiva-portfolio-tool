//import { routerReducer } from 'react-router-redux'
import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import user from './user'
import auth from './auth'

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    user,
    auth
  })

export default createRootReducer

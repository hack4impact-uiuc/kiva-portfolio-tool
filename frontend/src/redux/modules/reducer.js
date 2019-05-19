import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import user from './user'

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    user
  })

export default createRootReducer

// @flow
import { createStore, applyMiddleware, compose } from 'redux'
//import { routerMiddleware } from 'react-router-redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'
import createRootReducer from './modules/reducer'

export const history = createBrowserHistory()
const middleware = [thunk, routerMiddleware(history)]
const composedMiddleware = compose(applyMiddleware(...middleware))
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(history), preloadedState, devtools(composedMiddleware))
}

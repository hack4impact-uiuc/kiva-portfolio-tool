// @flow
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import reducer from './modules/reducer'

export const history = createHistory()
const middleware = [thunk, routerMiddleware(history)]
const composedMiddleware = compose(applyMiddleware(...middleware))

export default function configureStore() {
  return createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    composedMiddleware
  )
}

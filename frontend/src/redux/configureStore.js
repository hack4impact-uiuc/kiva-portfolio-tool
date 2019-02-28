// @flow
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import reducer from './modules/reducer'
import { loadState, saveState } from './localStorage'

export const history = createHistory()
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleware = [thunk, routerMiddleware(history)]
const composedMiddleware = compose(applyMiddleware(...middleware))
const persistedState = loadState()

const savePersistedState = store => () => {
  saveState({ searches: store.getState().results.searches })
}

export default function configureStore() {
  let store = createStore(reducer, persistedState, devtools(composedMiddleware))
  store.subscribe(savePersistedState(store))
  return store
}

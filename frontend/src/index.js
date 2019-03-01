import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
//import { ConnectedRouter } from 'react-router-redux'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './redux/configureStore'
import { Dashboard } from './components'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

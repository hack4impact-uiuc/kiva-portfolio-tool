import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './redux/configureStore'
import { Dashboard, LoginPage, BoxPreview } from './components'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './styles/index.scss'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/preview" component={BoxPreview} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

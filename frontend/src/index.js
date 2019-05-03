import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './redux/configureStore'
import {
  Dashboard,
  PMMainPage,
  SelectDocumentsPage,
  DocumentClassPage,
  DocumentPreview,
  Register,
  LogIn,
  LoginPage,
  ForgotPassword,
  Load
} from './components'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './styles/index.scss'
require('typeface-rubik')

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <div className="maxheight">
        <Load />
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route path="/login" component={LogIn} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard/:user/:id" component={Dashboard} />
          <Route path="/main" component={PMMainPage} />
          <Route path="/selectdocumentspage/:id" component={SelectDocumentsPage} />
          <Route path="/documentclasspage" component={DocumentClassPage} />
          <Route path="/view/:name/:id" component={DocumentPreview} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

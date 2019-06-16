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
  DocumentView,
  Register,
  LogIn,
  ForgotPassword,
  Load,
  WrongPage,
  ErrorMessage,
  ChangePassword,
  TemporaryPasswordReroute,
  ChangeSecurityQuestion
} from './components'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'box-ui-elements/dist/preview.css'
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
          <Route path="/changePassword" component={ChangePassword} />
          <Route path="/temporary" component={TemporaryPasswordReroute} />
          <Route path="/changeSecurityQuestion" component={ChangeSecurityQuestion} />
          <Route path="/dashboard/:user/:id" component={Dashboard} />
          <Route path="/overview/:id" component={PMMainPage} />
          <Route path="/setup/:id" component={SelectDocumentsPage} />
          <Route path="/documentclasses" component={DocumentClassPage} />
          <Route path="/view/:name/:user/:id" component={DocumentView} />
          <Route path="/oops" component={WrongPage} />
          <Route path="*" component={ErrorMessage} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

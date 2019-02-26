import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { LoginPage } from './components'

ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <Route exact path="/" component={LoginPage} />
  </Router>,
  document.getElementById('root')
)
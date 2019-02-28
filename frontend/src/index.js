import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard.js'
import '../node_modules/bootstrap/dist/css/bootstrap.css'

ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <Route exact path="/" component={Dashboard} />
  </Router>,
  document.getElementById('root')
)
//ServiceWorker()

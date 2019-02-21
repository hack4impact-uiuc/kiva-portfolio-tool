import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { DocumentList } from './components'

ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <Route exact path="/" component={DocumentList} />
  </Router>,
  document.getElementById('root')
)
//ServiceWorker()

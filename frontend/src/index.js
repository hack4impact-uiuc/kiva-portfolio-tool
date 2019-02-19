import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { DocumentList } from './components'
import ServiceWorker from './serviceWorker.js'
//import './styles/htmlstyles.scss'

class ScrollToTop extends Component {
  /*
    componentDidUpdate(prevProps) {
        if (
            this.props.location !== prevProps.location &&
            !(
                this.props.location.pathname === '/results' &&
                prevProps.location.pathname === '/description'
            ) &&
            !(
                this.props.location.pathname === '/description' &&
                prevProps.location.pathname === '/results'
            ) &&
            !(this.props.location.pathname === '/' && this.props.location.hash !== '')
        ) {
            window.scrollTo(0, 0)
        }
    }
    */

  render() {
    return this.props.children
  }
}

ReactDOM.render(
  <Router onUpdate={() => window.scrollTo(0, 0)}>
    <Route exact path="/" component={DocumentList} />
  </Router>,
  document.getElementById('root')
)
//ServiceWorker()

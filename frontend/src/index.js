import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, withRouter } from 'react-router'
import { DocumentList } from './components'
import registerServiceWorker from './registerServiceWorker'
import './styles/htmlstyles.scss'

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
const TopScroll = withRouter(ScrollToTop)

ReactDOM.render(
  <Route onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <TopScroll>
      <div className="heightDef">
        <Route exact path="/" component={DocumentList} />
      </div>
    </TopScroll>
  </Route>,
  document.getElementById('root')
)
registerServiceWorker()

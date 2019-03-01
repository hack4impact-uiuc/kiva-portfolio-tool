import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, withRouter } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import configureStore, { history } from './redux/configureStore'
import Dashboard from './components/Dashboard.js'

const store = configureStore()

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    window.scrollTo(0, 0)
  }

  render() {
    return this.props.children
  }
}

const TopScroll = withRouter(ScrollToTop)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <TopScroll>
        <div className="heightDef">
          <Route exact path="/" component={Dashboard} />
        </div>
      </TopScroll>
    </ConnectedRouter>
    , document.getElementById('root')
  </Provider>
)
//ServiceWorker()

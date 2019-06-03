import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../styles/login.scss'
import '../../styles/navbar.scss'

/**
 * If the user navigates to page given incorrect information passed in
 * shows them this error 404 not found page
 */
class Wrong extends Component {
  render() {
    return (
      <div>
        <p>404: Wrong Information Provided!</p>
      </div>
    )
  }
}
export default connect()(Wrong)

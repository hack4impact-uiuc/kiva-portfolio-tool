import React, { Component } from 'react'

import { connect } from 'react-redux'

import '../../styles/login.scss'
import '../../styles/navbar.scss'

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * If the user navigates to page given incorrect information passed in
 * shows them this error 404 not found page
 */
class Wrong extends Component {
  languages = {
    English: {
      message: '404: Wrong Information Provided!'
    },
    Spanish: {
      message: '404: Wrong Information Provided! (Spanish)'
    },
    French: {
      message: '404: Wrong Information Provided! (French)'
    },
    Portuguese: {
      message: '404: Wrong Information Provided! (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

    return (
      <div>
        <p>{text.message}</p>
      </div>
    )
  }
}
export default connect(mapStateToProps)(Wrong)

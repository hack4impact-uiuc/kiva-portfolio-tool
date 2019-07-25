import React, { Component } from 'react'

import { connect } from 'react-redux'

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * If the user navigates to page that doesn't exist
 * shows them this error 404 not found page
 */
export class ErrorMessage extends Component {
  languages = {
    English: {
      error: 'ERROR 404. This page could not be found. :('
    },
    Spanish: {
      error: 'Error 404. Esta página de web no puede ser ubica. :('
    },
    French: {
      error: 'Erreur 404. Page non trouvée. :('
    },
    Portuguese: {
      error: 'Oops, você encontrou nossa página 404.'
    }
  }

  render() {
    let text = this.languages[this.props.language]

    if (!text) {
      text = this.languages['English']
    }

    return (
      <div>
        <h3 style={{ textAlign: 'center', padding: 150 }}>{text.error}</h3>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ErrorMessage)

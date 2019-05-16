import React, { Component } from 'react'

/**
 * If the user navigates to page that doesn't exist
 * shows them this error 404 not found page
 */
export class ErrorMessage extends Component {
  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'center', padding: 150 }}>
          ERROR 404. This page could not be found. :(
        </h3>
      </div>
    )
  }
}

export default ErrorMessage

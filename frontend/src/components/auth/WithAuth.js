import React, { Component } from 'react'

import { verify } from '../../utils/ApiWrapper'
import { setCookie } from '../../utils/cookie'

/**
 * Page that shows up when user authenticates,
 * If authenticated then redirects to home page
 * else shows not authenticated
 */
const withAuth = WrappedComponent => {
  class HOC extends Component {
    constructor(props) {
      super(props)
      this.state = {
        verified: false
      }
    }

    async componentDidMount() {
      const verifyResponse = await verify()
      if (verifyResponse.error) {
        return
      }
      const verifyResponseParsed = verifyResponse.response
      if (verifyResponseParsed.status === 200) {
        if (verifyResponseParsed.newToken !== undefined) {
          setCookie('token', verifyResponseParsed.newToken)
        }
        this.setState({ verified: true })
      } else {
        this.props.history.push('/register')
      }
    }

    render() {
      return (
        <div>
          {this.state.verified ? (
            <WrappedComponent {...this.props} verified={this.state.verified} />
          ) : (
            <div>
              <p>You are not authenticated.</p>
            </div>
          )}
        </div>
      )
    }
  }

  return HOC
}

export default withAuth

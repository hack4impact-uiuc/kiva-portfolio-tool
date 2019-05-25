import React, { Component } from 'react'

import { connect } from 'react-redux'

import { verify } from '../../utils/ApiWrapper'
import { setCookie } from '../../utils/cookie'

const mapStateToProps = state => ({
  language: state.user.language
})

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
      console.log(verifyResponse)
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

    languages = {
      English: {
        message: 'You are not authenticated.'
      },
      Spanish: {
        message: 'You are not authenticated. (Spanish)'
      },
      French: {
        message: 'You are not authenticated. (French)'
      },
      French: {
        message: 'You are not authenticated. (Portuguese)'
      }
    }

    render() {
      let text = this.languages[this.props.language]

      return (
        <div>
          {this.state.verified ? (
            <WrappedComponent {...this.props} verified={this.state.verified} />
          ) : (
            <div>
              <p>{text.message}</p>
            </div>
          )}
        </div>
      )
    }
  }

  return HOC
}

export default connect(mapStateToProps)(withAuth)

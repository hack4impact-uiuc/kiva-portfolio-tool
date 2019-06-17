import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { beginLoading, endLoading } from '../../redux/modules/user'

import { verify } from '../../utils/ApiWrapper'
import { setCookie } from '../../utils/cookie'

import { Load } from '../'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      beginLoading,
      endLoading
    },
    dispatch
  )
}

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
        verified: null
      }
    }

    async componentDidMount() {
      this.props.beginLoading()
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
      this.props.endLoading()
    }

    render() {
      return (
        <div>
          {this.state.verified ? (
            <WrappedComponent verified={this.state.verified} {...this.props} />
          ) : this.state.verified === null ? (
            <Load />
          ) : (
            <div>
              <p>You are not authenticated.</p>
              <a href="/">Back to login</a>
            </div>
          )}
        </div>
      )
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(HOC)
}

export default withAuth

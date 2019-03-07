import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popup } from 'react-popup'
import { Alert, Button } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { login } from '../redux/modules/auth'
import { setUserType } from '../redux/modules/user'

const mapStateToProps = state => ({
  verified: state.auth.verified,
  isPM: state.user.isPM
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login,
      setUserType
      /* beginLoading,
      endLoading */
    },
    dispatch
  )
}

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      email: '',
      valid: ['pm@kiva.com', 'fp@kiva.com', 'kiva']
    }
  }

  updatePassword = event => {
    this.setState({ password: event.target.value })
  }

  updateEmail = event => {
    this.setState({ email: event.target.value })
  }

  verify = event => {
    /* this.props.beginLoading() */
    this.props.login(
      this.state.valid.indexOf(this.state.email) > -1 &&
        this.state.valid.indexOf(this.state.password) > -1
    )
    this.props.setUserType(this.state.email === 'pm@kiva.com' && this.state.password === 'kiva')
    if (this.props.verified === true) {
      this.props.history.push('/dashboard')
    }
    /* else{
			alert('Email or password is invalid.\nPlease try again.')
		} */
  }

  render() {
    return (
      <div>
        <div style={{ paddingLeft: '5%' }}>
          <p>Kiva</p>
        </div>
        <form onSubmit={this.verify}>
          <span> Email: </span>
          <input onChange={this.updateEmail} />
          <br />
          <span> Password: </span>
          <input onChange={this.updatePassword} />
          <br />
          <Button type="submit" onClick={this.verify}>
            Sign In
          </Button>
        </form>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)

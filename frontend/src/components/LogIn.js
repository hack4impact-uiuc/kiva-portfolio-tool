import { Link } from 'react-router-dom'
import { login } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import {
  Form,
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap'
import { setCookie } from './../utils/cookie'
import { connect } from 'react-redux'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import React, { Component } from 'react'
import BackgroundSlideshow from 'react-background-slideshow'
import Navbar from './NavBar'
import kivaLogo from '../media/kivaPlainLogo.png'

import '../styles/index.css'
import '../styles/login.css'
import '../styles/navbar.css'

import b1 from '../media/b1-min.jpg'
import b3 from '../media/b3-min.jpg'
import b4 from '../media/b4-min.jpg'
import b5 from '../media/b5-min.jpg'
import b6 from '../media/b6-min.jpg'

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"
// const PASSWORD_REGEX = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";

class LogIn extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: '',
    username: ''
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const result = await login(this.state.email, this.state.password)
    let token = result.response.data.result.token

    if (!token) {
      this.setState({ errorMessage: result.response.message })
    } else {
      setCookie('token', token)
      this.props.history.push('/dashboard')
    }
  }

  render() {
    return (
      <div>
        <Navbar className="nav-absolute" />
        <div className="background">
          <BackgroundSlideshow images={[b1, b3, b4, b5, b6]} animationDelay={5000} />
        </div>
        <div className="foreground">
          <Card className="interview-card center-background">
            <CardBody>
              <div className="text-centered" id="login-kiva-logo">
                <img src={kivaLogo} />
              </div>
              <Form>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    id="exampleEmail"
                    maxLength="64"
                    pattern={EMAIL_REGEX}
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="examplePassword"
                    minLength="8"
                    maxLength="64"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <div className="text-centered">
                  <Button color="success" size="lg" onClick={this.handleSubmit} className="right">
                    Log In
                  </Button>
                  {''}
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/register')}
                    className="left left-margin-lg"
                  >
                    Register
                  </Button>
                </div>
              </Form>
              <p style={{ color: 'red' }}>
                {this.state.errorMessage ? this.state.errorMessage : ''}
              </p>
              <Link
                id="forgot"
                className="text-centered margin-center"
                to="/forgotPassword"
                prefetch
                href="/forgotPassword"
              >
                Forgot Password?
              </Link>
            </CardBody>
          </Card>
          <br />
        </div>
      </div>
    )
  }
}
export default connect(mapDispatchToProps)(LogIn)

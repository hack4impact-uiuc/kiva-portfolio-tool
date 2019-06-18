import React, { Component } from 'react'
import BackgroundSlideshow from 'react-background-slideshow'
import { Form, Button, FormGroup, Input, Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import Navbar from '../NavBar'

import { login, verify, getFPByEmail, getPMByEmail } from '../../utils/ApiWrapper'
import { setCookie } from '../../utils/cookie'

import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'
import kivaLogo from '../../media/kivaPlainLogo.png'

import '../../styles/index.css'
import '../../styles/login.css'
import '../../styles/navbar.css'

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * This is the login page.
 * It contains a form that takes in user email and password
 * In case of forgotten password, it has a Forgot Password button that leads to a recovery page
 */
class LogIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      wrongInfo: false
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const result = await login(this.state.email, this.state.password)
    if (
      result.error != null &&
      (result.error.response.status === 400 || result.error.response.status === 500)
    ) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.error.response.data.message
      })
      return
    }

    let token = result.response.data.result.token

    if (!token) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.response.message
      })
    } else {
      this.setState({
        wrongInfo: !this.state.wrongInfo
      })
      await setCookie('token', token)
      let role = await verify()
      if (role.error) {
        this.props.history.push('/oops')
      } else {
        role = role.response.data.result.role

        if (role === 'fp') {
          let fp = await getFPByEmail(this.state.email)
          if (fp) {
            this.props.history.push('/dashboard/fp/' + fp._id)
          } else {
            this.setState({
              wrongInfo: !this.state.wrongInfo,
              errorMessage: 'Provided Field Partner does not exist!'
            })
          }
        } else {
          let pm = await getPMByEmail(this.state.email)
          if (pm) {
            this.props.history.push('/overview/' + pm._id)
          } else {
            this.setState({
              wrongInfo: !this.state.wrongInfo,
              errorMessage: 'Provided Portfolio Manager does not exist!'
            })
          }
        }
      }
    }
  }

  languages = {
    English: {
      email: 'Email',
      password: 'Password',
      logIn: 'Log in',
      register: 'Register',
      forgotPassword: 'Forgot password?'
    },
    Spanish: {
      email: 'Email (Spanish)',
      password: 'Password (Spanish)',
      logIn: 'Log in (Spanish)',
      register: 'Register (Spanish)',
      forgotPassword: 'Forgot password? (Spanish)'
    },
    French: {
      email: 'Email (French)',
      password: 'Password (French)',
      logIn: 'Log in (French)',
      register: 'Register (French)',
      forgotPassword: 'Forgot password? (French)'
    },
    Portuguese: {
      email: 'Email (Portuguese)',
      password: 'Password (Portuguese)',
      logIn: 'Log in (Portuguese)',
      register: 'Register (Portuguese)',
      forgotPassword: 'Forgot password? (Portuguese)'
    }
  }

  render() {
    let text = this.languages[this.props.language]
    if (!text) {
      text = this.languages['English']
    }

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
                <img src={kivaLogo} alt="Kiva logo" />
              </div>
              <Form>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    placeholder={text.email}
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
                    placeholder={text.password}
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
                    {text.logIn}
                  </Button>
                  {''}
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/register')}
                    className="left left-margin-lg"
                  >
                    {text.register}
                  </Button>
                </div>
              </Form>
              <p style={{ color: 'red', textAlign: 'center' }}>
                {this.state.errorMessage ? this.state.errorMessage : ''}
              </p>
              <Link
                id="forgot"
                className="text-centered margin-center"
                to="/forgotPassword"
                href="/forgotPassword"
              >
                {text.forgotPassword}
              </Link>
            </CardBody>
          </Card>
          <br />
        </div>
      </div>
    )
  }
}
export default connect(mapStateToProps)(LogIn)

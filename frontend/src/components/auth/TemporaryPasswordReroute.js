import { login, verify } from '../../utils/ApiWrapper'
import { Form, Button, FormGroup, Input, Card, CardBody } from 'reactstrap'
import { setCookie } from '../../utils/cookie'
import React, { Component } from 'react'
import BackgroundSlideshow from 'react-background-slideshow'
import Navbar from '../NavBar'

import '../../styles/index.css'
import '../../styles/login.css'
import '../../styles/navbar.css'

import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'
import kivaLogo from '../../media/kivaPlainLogo.png'

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"

/**
 * This is the login page.
 * It contains a form that takes in user email and password
 * In case of forgotten password, it has a Forgot Password button that leads to a recovery page
 */
class TemporaryPasswordReroute extends Component {
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
        this.props.history.push('/changePassword')
      }
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
                <img src={kivaLogo} alt="Kiva logo" />
              </div>
              <Form onSubmit={this.handleSubmit}>
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
                  <Button
                    type="submit"
                    color="success"
                    size="lg"
                    onClick={this.handleSubmit}
                    className="right"
                  >
                    Log In
                  </Button>
                  {''}
                </div>
              </Form>
              <p style={{ color: 'red' }}>
                {this.state.errorMessage ? this.state.errorMessage : ''}
              </p>
            </CardBody>
          </Card>
          <br />
        </div>
      </div>
    )
  }
}
export default TemporaryPasswordReroute

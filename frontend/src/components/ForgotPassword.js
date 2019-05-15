import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import {
  getSecurityQuestionForUser,
  submitSecurityQuestionAnswer,
  resetPassword
} from '../utils/ApiWrapper'
import { Form, Button, FormGroup, Label, Input, Card, Alert, CardBody, CardTitle } from 'reactstrap'
import { connect } from 'react-redux'
import { setCookie } from '../utils/cookie'
import Navbar from './NavBar'
import BackgroundSlideshow from 'react-background-slideshow'

import '../styles/index.css'
import '../styles/login.css'

import kivaLogo from '../media/kivaPlainLogo.png'
import b1 from '../media/b1-min.jpg'
import b3 from '../media/b3-min.jpg'
import b4 from '../media/b4-min.jpg'
import b5 from '../media/b5-min.jpg'
import b6 from '../media/b6-min.jpg'

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"
// const PASSWORD_REGEX = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";

export class ForgotPassword extends Component {
  state = {
    email: '',
    question: '',
    errorMessage: '',
    answer: '',
    pin: '',
    password: '',
    password2: '',
    loadingAPI: false,
    submitNewPassword: false
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleGetSecurityQuestion = async e => {
    e.preventDefault()
    const result = await getSecurityQuestionForUser(this.state.email)
    if (result) {
      const resp = await result.json()
      if (!!resp.question) {
        this.setState({ question: resp.question, errorMessage: '' })
      } else {
        this.setState({ errorMessage: resp.message })
      }
    }
  }

  handleSubmitSecurityAnswer = async e => {
    e.preventDefault()

    this.setState({ loadingAPI: true })
    const result = await submitSecurityQuestionAnswer(this.state.email, this.state.answer)

    if (result) {
      const resp = await result.json()
      if (resp.status === 200) {
        this.setState({ submitNewPassword: true, errorMessage: '' })
      } else {
        this.setState({ errorMessage: resp.message })
      }
    }
  }

  handleSubmitNewPassword = async e => {
    e.preventDefault()
    if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: "Passwords don't match!" })
      return
    }
    const response = await resetPassword(
      this.state.pin,
      this.state.email,
      this.state.password,
      this.state.answer
    )
    if (response) {
      response = response.json()
      if (response.status === 200 && response.token) {
        setCookie('token', response.token)
        this.setState({ successfulSubmit: true })
        this.props.history.push('/')
      } else {
        this.setState({ errorMessage: response.message })
      }
    }
  }

  render = () => (
    <div>
      <Navbar className="nav-absolute" />
      <div className="background">
        <BackgroundSlideshow images={[b1, b3, b4, b5, b6]} animationDelay={5000} />
      </div>
      {this.state.errorMessage !== '' && <Alert color="danger">{this.state.errorMessage}</Alert>}
      {this.state.submitNewPassword ? (
        <div className="foreground">
          <Card className="interview-card">
            <CardTitle>
              <div className="text-centered" id="login-kiva-logo">
                <img src={kivaLogo} />
              </div>
            </CardTitle>

            <CardBody>
              <Form>
                <FormGroup>
                  <Label>Pin</Label>
                  <Input name="pin" value={this.state.pin} onChange={this.handleChange} required />
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
                <FormGroup>
                  <Input
                    type="password"
                    name="password2"
                    placeholder="Confirm Password"
                    id="exampleConfirm"
                    minLength="8"
                    maxLength="64"
                    value={this.state.password2}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <div className="text-centered">
                  <Button
                    color="success"
                    size="lg"
                    onClick={this.handleSubmitNewPassword}
                    className="right"
                  >
                    Reset Password
                  </Button>{' '}
                </div>
              </Form>
            </CardBody>
            <div style={{ textAlign: 'center' }}>
              <Link to="/login" prefetch href="/login">
                <a>Back to login page</a>
              </Link>
            </div>
          </Card>
        </div>
      ) : (
        <div className="foreground">
          {this.state.question === '' ? (
            <Card className="interview-card">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} />
                </div>
              </CardTitle>

              <CardBody>
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
                  <div className="text-centered">
                    <Button
                      color="success"
                      size="lg"
                      onClick={this.handleGetSecurityQuestion}
                      className="right"
                    >
                      Get Security Question
                    </Button>

                    {this.state.errorMessage}
                  </div>
                </Form>
              </CardBody>
              <div style={{ textAlign: 'center' }}>
                <Link to="/login" prefetch href="/login">
                  <a>Back to login page</a>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="interview-card">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} />
                </div>
              </CardTitle>

              <CardBody>
                <Form>
                  <FormGroup>
                    <p> {this.state.question}</p>
                    <Input
                      type="answer"
                      name="answer"
                      placeholder="Answer"
                      id="exampleAnswer"
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                  <div className="text-centered">
                    <Button
                      color="success"
                      size="lg"
                      onClick={this.handleSubmitSecurityAnswer}
                      className="right"
                      disabled={this.state.loadingAPI}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </Form>
              </CardBody>
              <div style={{ textAlign: 'center' }}>
                <Link to="/login" prefetch href="/login">
                  <a>Back to login page</a>
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
export default connect()(ForgotPassword)

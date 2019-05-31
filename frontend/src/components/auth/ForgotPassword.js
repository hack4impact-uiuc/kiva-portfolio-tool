import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import {
  getSecurityQuestionForUser,
  submitSecurityQuestionAnswer,
  resetPassword
} from '../../utils/ApiWrapper'
import { Form, Button, FormGroup, Label, Input, Card, Alert, CardBody, CardTitle } from 'reactstrap'
import { connect } from 'react-redux'
import { setCookie } from '../../utils/cookie'
import Navbar from '../NavBar'
import BackgroundSlideshow from 'react-background-slideshow'

import '../../styles/login.scss'

import kivaLogo from '../../media/kivaPlainLogo.png'
import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"
// const PASSWORD_REGEX = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";

/**
 * This Component handles the case where a user forgets their password
 * It contains a form to take in any information required for the user to reset their password
 * It is a multi-step recovery system
 * It has a button to return back to the login page
 */
export class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleGetSecurityQuestion = async e => {
    e.preventDefault()
    const result = await getSecurityQuestionForUser(this.state.email)

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong email!'
      })
      return
    }

    let question = result.response.data.result.question

    if (!question) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.response.message
      })
    } else {
      this.setState({
        wrongInfo: !this.state.wrongInfo
      })
      this.setState({ question: question, errorMessage: '' })
    }
  }

  handleSubmitSecurityAnswer = async e => {
    e.preventDefault()

    this.setState({ loadingAPI: true })
    const result = await submitSecurityQuestionAnswer(this.state.email, this.state.answer)

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong answer!',
        loadingAPI: false
      })
      return
    }
    this.setState({ submitNewPassword: true, errorMessage: '' })
  }

  handleSubmitNewPassword = async e => {
    e.preventDefault()
    if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: "Passwords don't match!" })
      return
    }
    const result = await resetPassword(
      this.state.email,
      this.state.answer,
      this.state.pin,
      this.state.password
    )

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong input!'
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
      this.setState({ successfulSubmit: true })
      this.props.history.push('/')
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
                <img src={kivaLogo} alt="Kiva logo" />
              </div>
            </CardTitle>

            <CardBody>
              <Form>
                <FormGroup>
                  <Input
                    id="examplePassword"
                    name="pin"
                    placeholder="pin"
                    value={this.state.pin}
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
                <a href="/login">Back to login page</a>
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
                  <img src={kivaLogo} alt="Kiva logo" />
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
                  </div>
                </Form>
              </CardBody>
              <div style={{ textAlign: 'center' }}>
                <Link to="/login" prefetch href="/login">
                  <a href="/login">Back to login page</a>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="interview-card">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} alt="Kiva logo" />
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
                  <a href="/login">Back to login page</a>
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

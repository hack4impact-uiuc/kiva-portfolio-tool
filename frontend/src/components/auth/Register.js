import React, { Component } from 'react'
import {
  Form,
  Button,
  FormGroup,
  Input,
  Card,
  CardBody,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap'
import BackgroundSlideshow from 'react-background-slideshow'

import { connect } from 'react-redux'

import Navbar from '../NavBar'

import { setCookie } from '../../utils/cookie'
import { register, verifyPIN, getSecurityQuestions } from '../../utils/ApiWrapper'

import kivaLogo from '../../media/kivaPlainLogo.png'
import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'

import '../../styles/login.css'

// michael's baby
const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * Page that handles a new user registering
 * it has inputs for email, password, re-enter password,
 * it also has inputs for a verification pin to verify if a legit user is creating an account
 */
class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      password2: '',
      errorMessage: '',
      pinMessage: '',
      pin: '',
      successfulSubmit: false,
      loading: false,
      questions: [],
      questionIdx: -1,
      dropdownOpen: false,
      securityQuestionAnswer: '',
      failed: false,
      modal: false
    }
  }

  pickDropDown = (idx, e) => {
    this.setState({ questionIdx: idx })
  }
  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  handleChange = event => {
    const value = event.target.value
    const name = event.target.name
    this.setState({ [name]: value })
  }

  handleChangeSecurityAnswer = event => {
    const value = event.target.value
    this.setState({ securityQuestionAnswer: value })
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const resp = await getSecurityQuestions()
    if (!resp) {
      this.setState({ error: 'unable to load data' })
      return
    } else if (resp.type === 'LOGIN_FAIL') {
      this.setState({ failed: !this.state.failed, modal: !this.state.modal })
      return
    }
    let questions = resp.response.data.result.questions
    if (questions) {
      this.setState({ questions: questions })
    } else {
      this.setState({ loading: false, errorMessage: resp.response.message })
    }
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (
      this.state.password === this.state.password2 &&
      this.state.questionIdx !== -1 &&
      this.state.securityQuestionAnswer !== ''
    ) {
      let result = await register(
        this.state.email,
        this.state.password,
        this.state.questionIdx,
        this.state.securityQuestionAnswer,
        'pm'
      )
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
          errorMessage: result.response.message,
          modal: !this.state.modal,
          failed: !this.state.failed
        })
      } else {
        setCookie('token', token)
        this.setState({
          successfulSubmit: true
        })
      }
    } else if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: 'Passwords do not match ' })
    } else if (this.state.questionIdx === -1) {
      this.setState({ errorMessage: 'Select a question' })
    } else if (!this.state.securityQuestionAnswer) {
      this.setState({ errorMessage: 'Answer not selected' })
    }
  }

  errorToggle = () => {
    this.setState({ modal: !this.state.modal, failed: !this.state.failed })
  }

  handlePINVerify = async e => {
    e.preventDefault()
    const result = await verifyPIN(this.state.pin)

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

    let pinMessage = result.response.message
    this.setState({ pinMessage: pinMessage })
    if (result.response.status === 200) {
      this.props.history.push('/')
    }
  }

  roletoggle = () => {
    this.setState({ roleDropdownOpen: !this.state.roleDropdownOpen })
  }

  languages = {
    English: {
      securityQuestion: 'Security question',
      answer: 'Answer',
      email: 'Email',
      password: 'Password',
      confirm: 'Confirm password',
      register: 'Register',
      logIn: 'Log in',
      pin: 'PIN',
      resendPin: 'Resend PIN',
      verify: 'Verify email',
      skip: 'Skip verification'
    },
    Spanish: {
      securityQuestion: 'Security question (Spanish)',
      answer: 'Answer (Spanish)',
      email: 'Email (Spanish)',
      password: 'Password (Spanish)',
      confirm: 'Confirm password (Spanish)',
      register: 'Register (Spanish)',
      logIn: 'Log in (Spanish)',
      pin: 'PIN (Spanish)',
      resendPin: 'Resend PIN (Spanish)',
      verify: 'Verify email (Spanish)',
      skip: 'Skip verification (Spanish)'
    },
    French: {
      securityQuestion: 'Security question (French)',
      answer: 'Answer (French)',
      email: 'Email (French)',
      password: 'Password (French)',
      confirm: 'Confirm password (French)',
      register: 'Register (French)',
      logIn: 'Log in (French)',
      pin: 'PIN (French)',
      resendPin: 'Resend PIN (French)',
      verify: 'Verify email (French)',
      skip: 'Skip verification (French)'
    },
    Portuguese: {
      securityQuestion: 'Security question (Portuguese)',
      answer: 'Answer (Portuguese)',
      email: 'Email (Portuguese)',
      password: 'Password (Portuguese)',
      confirm: 'Confirm password (Portuguese)',
      register: 'Register (Portuguese)',
      logIn: 'Log in (Portuguese)',
      pin: 'PIN (Portuguese)',
      resendPin: 'Resend PIN (Portuguese)',
      verify: 'Verify email (Portuguese)',
      skip: 'Skip verification (Portuguese)'
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
        {!this.state.successfulSubmit ? (
          <div className="foreground" id="register-foreground">
            <Card className="interview-card center-background">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} alt="Kiva logo" />
                </div>
              </CardTitle>
              <CardBody>
                {!!this.state.questions ? (
                  <React.Fragment>
                    <div className="text-centered">
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="transparent">
                          {this.state.questionIdx === -1
                            ? text.securityQuestion
                            : this.state.questions[this.state.questionIdx]}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.questions.map((question, idx) => (
                            <DropdownItem key={idx} onClick={this.pickDropDown.bind(null, idx)}>
                              {question}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Input
                      type="email"
                      name="email"
                      placeholder={text.answer}
                      id="exampleAnswer"
                      maxLength="64"
                      pattern={EMAIL_REGEX}
                      value={this.state.securityQuestionAnswer}
                      onChange={this.handleChangeSecurityAnswer}
                      required
                    />
                  </React.Fragment>
                ) : null}
                <Form onSubmit={this.handleSubmit}>
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
                      id="registerPassword"
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
                      placeholder={text.confirm}
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
                      type="submit"
                      color="success"
                      size="lg"
                      onClick={this.handleSubmit}
                      className="right"
                    >
                      {text.register}
                    </Button>{' '}
                    <Button
                      color="success"
                      size="lg"
                      onClick={() => this.props.history.push('/login')}
                      className="left left-margin-lg"
                    >
                      {text.logIn}
                    </Button>
                    <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        ) : (
          <div className="foreground">
            <Card className="interview-card center-background">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} alt="Kiva logo" />
                </div>
              </CardTitle>
              <CardBody className="text-centered">
                <Form onSubmit={this.handlePINVerify}>
                  <FormGroup>
                    <p style={{ color: 'green' }}>{this.state.pinMessage}</p>
                    <Input
                      name="pin"
                      placeholder="Pin"
                      id="examplePin"
                      type="number"
                      maxLength="10"
                      minLength="4"
                      value={this.state.pin}
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/login')}
                    className="left"
                  >
                    {text.resendPin}
                  </Button>
                  <Button
                    type="submit"
                    color="success"
                    size="lg"
                    onClick={this.handlePINVerify}
                    className="right left-margin-lg"
                  >
                    {text.verify}
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => this.props.history.push('/')}
                    style={{
                      float: 'right',
                      width: '25%',
                      marginRight: '10%'
                    }}
                  >
                    {text.skip}
                  </Button>
                </Form>
                {this.state.passwordChangeMessage}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Register)

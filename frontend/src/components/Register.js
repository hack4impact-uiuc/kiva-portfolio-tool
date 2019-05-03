import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalFooter,
  ModalBody
} from 'reactstrap'
import { setCookie } from './../utils/cookie'
import {
  register,
  verifyPIN,
  resendPIN,
  getSecurityQuestions,
  setSecurityQuestion
} from '../utils/ApiWrapper'
import BackgroundSlideshow from 'react-background-slideshow'
import Navbar from './NavBar'

import '../styles/login.css'

import kivaLogo from '../media/kivaPlainLogo.png'
import b1 from '../media/b1-min.jpg'
import b3 from '../media/b3-min.jpg'
import b4 from '../media/b4-min.jpg'
import b5 from '../media/b5-min.jpg'
import b6 from '../media/b6-min.jpg'

// michael's baby
const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"

class Register extends React.Component {
  state = {
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
    const name = event.target.name
    this.setState({ securityQuestionAnswer: value })
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const resp = await getSecurityQuestions()
    if (!resp) {
      this.setState({ error: 'unable to load data' })
      return
    } else if (resp.type == 'LOGIN_FAIL') {
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
        (result.error.response.status == 400 || result.error.response.status == 500)
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
      (result.error.response.status == 400 || result.error.response.status == 500)
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

  handlePINResend = async e => {
    e.preventDefault()
    const result = await resendPIN()

    if (result.type == 'LOGIN_FAIL') {
      this.setState({
        modal: !this.state.modal,
        failed: !this.state.failed
      })
      return
    }

    let pinMessage = result.response.message
    this.setState({ pinMessage: pinMessage })
  }

  roletoggle = () => {
    this.setState({ roleDropdownOpen: !this.state.roleDropdownOpen })
  }

  render = () => (
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
                <img src={kivaLogo} />
              </div>
            </CardTitle>
            <CardBody>
              {!!this.state.questions ? (
                <React.Fragment>
                  <div className="text-centered">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                      <DropdownToggle caret color="transparent">
                        {this.state.questionIdx === -1
                          ? 'Security Question'
                          : this.state.questions[this.state.questionIdx]}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.questions.map((question, idx) => (
                          <DropdownItem onClick={this.pickDropDown.bind(null, idx)}>
                            {question}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Answer"
                    id="exampleAnswer"
                    maxLength="64"
                    pattern={EMAIL_REGEX}
                    value={this.state.securityQuestionAnswer}
                    onChange={this.handleChangeSecurityAnswer}
                    required
                  />
                </React.Fragment>
              ) : null}
              <Form>
                <FormGroup>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                  <Button color="success" size="lg" onClick={this.handleSubmit} className="right">
                    Register
                  </Button>{' '}
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/login')}
                    className="left"
                  >
                    Login
                  </Button>
                  <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="check">
          <Card className="interview-card" style={{ width: '400px', height: '60%' }}>
            <CardBody>
              <Form>
                <FormGroup>
                  <p style={{ color: 'green' }}>{this.state.pinMessage}</p>
                  <Label>PIN</Label>
                  <Input
                    name="pin"
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
                  onClick={this.handlePINResend}
                  style={{
                    float: 'left',
                    marginBottom: '3%',
                    width: '100%'
                  }}
                >
                  Resend PIN
                </Button>
                <Button
                  color="success"
                  size="lg"
                  onClick={this.handlePINVerify}
                  style={{
                    float: 'left',
                    marginBotton: '3%',
                    width: '100%'
                  }}
                >
                  Verify Email
                </Button>
                <Button
                  color="link"
                  size="sm"
                  onClick={() => this.props.history.push('/')}
                  style={{
                    float: 'right',
                    width: '25%',
                    marginRight: '6%'
                  }}
                >
                  Skip Verification
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

export default connect()(Register)

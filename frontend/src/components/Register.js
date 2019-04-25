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
  Modal
} from 'reactstrap'
import { setCookie } from './../utils/cookie'
import {
  register,
  verifyPIN,
  resendPIN,
  getSecurityQuestions,
  setSecurityQuestion
} from '../utils/ApiWrapper'

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
    securityQuestionAnswer: ''
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
    }
    console.log(resp)
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
        'fp'
      )
      console.log(result)
      let token = result.response.data.result.token

      if (!token) {
        this.setState({ errorMessage: result.response.message })
      } else {
        setCookie('token', token)
        this.setState({ successfulSubmit: true })
      }
    } else if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: 'Passwords do not match ' })
    } else if (this.state.questionIdx === -1) {
      this.setState({ errorMessage: 'Select a question' })
    } else if (!this.state.securityQuestionAnswer) {
      this.setState({ errorMessage: 'Answer not selected' })
    }
  }

  handlePINVerify = async e => {
    e.preventDefault()
    const result = await verifyPIN(this.state.pin)
    let pinMessage = result.response.message
    this.setState({ pinMessage: pinMessage })
    if (pinMessage === 200) {
      this.props.history.push('/')
    }
  }

  handlePINResend = async e => {
    e.preventDefault()
    const result = await resendPIN()
    console.log(result)
    let pinMessage = result.response.message
    this.setState({ pinMessage: pinMessage })
  }

  roletoggle = () => {
    this.setState({ roleDropdownOpen: !this.state.roleDropdownOpen })
  }

  render = () => (
    <div>
      {' '}
      {!this.state.successfulSubmit ? (
        <div>
          <Card className="interview-card" style={{ width: '400px', height: '60%' }}>
            <CardTitle>
              <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>Register</h3>
            </CardTitle>
            <CardBody>
              {!!this.state.questions ? (
                <React.Fragment>
                  <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
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
                  <Label for="exampleEmail">Answer</Label>
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
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
                  <Label for="exampleEmail">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    maxLength="64"
                    pattern={EMAIL_REGEX}
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    minLength="8"
                    maxLength="64"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Confirm Password</Label>
                  <Input
                    type="password"
                    name="password2"
                    minLength="8"
                    maxLength="64"
                    value={this.state.password2}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <Button
                  color="success"
                  size="lg"
                  onClick={this.handleSubmit}
                  style={{ float: 'left', width: '48%' }}
                >
                  Register
                </Button>{' '}
                <Button
                  color="success"
                  size="lg"
                  onClick={() => this.props.history.push('/login')}
                  style={{ float: 'right', width: '49%' }}
                >
                  Login
                </Button>
                <br />
                <br />
                <br />
                <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
              </Form>
            </CardBody>
          </Card>
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default connect()(Register)

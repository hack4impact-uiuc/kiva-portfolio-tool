import React, { Component } from 'react'
import WithAuth from './WithAuth'
import Navbar from '../NavBar'
import {
  changePassword,
  updateSecurityQuestion,
  getSecurityQuestions
} from '../../utils/ApiWrapper'
import {
  Form,
  Button,
  FormGroup,
  Label,
  Input,
  CardTitle,
  Card,
  CardBody,
  Row,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap'
import { connect } from 'react-redux'
import { setCookie } from '../../utils/cookie'
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

class ChangePassword extends Component {
  state = {
    oldPassword: '',
    responseMessage: '',
    correctMessage: '',
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

  handleChangeSecurityAnswer = event => {
    const value = event.target.value
    this.setState({ securityQuestionAnswer: value })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
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

  errorToggle = () => {
    this.setState({ modal: !this.state.modal, failed: !this.state.failed })
  }

  handlePassChange = async e => {
    e.preventDefault()
    const result = await updateSecurityQuestion(
      this.state.questionIdx,
      this.state.securityQuestionAnswer,
      this.state.oldPassword
    )
    if (
      result.error != null &&
      (result.error.response.status === 400 || result.error.response.status === 500)
    ) {
      this.setState({
        responseMessage: result.error.response.data.message
      })
      return
    }

    this.setState({ correctMessage: 'Security Question has been changed!' })
  }

  render() {
    return (
      <div>
        <Navbar className="nav-absolute" />
        <div className="background">
          <BackgroundSlideshow images={[b1, b3, b4, b5, b6]} animationDelay={5000} />
        </div>
        <Row>
          <div className="foreground">
            <Card className="interview-card">
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
                      name="oldPassword"
                      placeholder="Password"
                      type="password"
                      maxLength="128"
                      id="examplePassword"
                      value={this.state.oldPassword}
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                  <div className="text-centered">
                    <Button
                      color="success"
                      size="lg"
                      onClick={() => this.props.history.push('/')}
                      className="right securitybtn"
                    >
                      Back to Login
                    </Button>
                    {''}
                    <Button
                      color="success"
                      size="lg"
                      onClick={this.handlePassChange}
                      className="left left-margin-lg securitybtn"
                    >
                      Change Question
                    </Button>
                  </div>
                </Form>
                <p style={{ color: 'red', textAlign: 'center' }}>
                  {this.state.responseMessage ? this.state.responseMessage : ''}
                </p>
                <p style={{ color: 'green', textAlign: 'center' }}>
                  {this.state.correctMessage ? this.state.correctMessage : ''}
                </p>
              </CardBody>
            </Card>
          </div>
        </Row>
      </div>
    )
  }
}

export default connect()(WithAuth(ChangePassword))

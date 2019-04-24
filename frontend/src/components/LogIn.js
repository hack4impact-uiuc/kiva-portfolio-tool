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
import '../styles/index.css'


const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"
// const PASSWORD_REGEX = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";

const userAdmin = {
  permissions : [
    "get:document",
    "all:message"
  ]
}

const userPM = {
  permissions : [
    "get:document",
    "post:document",
    "review:document",
    "delete:document",
    "all:docClass",
    "all:fp",
    "all:pm",
    "all:message"
  ]
}

const userFP = {
  permissions : [
    "get:document",
    "upload:document",
    "all:message"
  ]
}

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
    console.log(result)
    const data = result.response.data
    if (!data.result.token) {
      this.setState({ errorMessage: data.message })
    } else {
      setCookie('token', data.result.token)
      this.props.history.push('/dashboard')
    }
  }

  render() {
    return (
      <div>
        <Card
          className="interview-card center-background"
          style={{ width: '400px', height: '60%' }}
        >
          <CardTitle>
            <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>Login</h3>
          </CardTitle>

          <CardBody>
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
                  id="examplePassword"
                  minLength="8"
                  maxLength="64"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <Button color="success" size="lg" onClick={this.handleSubmit} className="right">
                Log In
              </Button>
              {''}
              <Button
                color="success"
                size="lg"
                onClick={() => this.props.history.push('/register')}
                className="left"
              >
                Register
              </Button>
            </Form>
            <br />
            {/* <p style={{ color: 'red' }}>{this.state.errorMessage ? this.state.errorMessage : ''}</p>
            <Link prefetch href="/forgotPassword">
              <a>Forgot Password?</a>
            </Link> */}
          </CardBody>
        </Card>
        <br />
      </div>
    )
  }
}
export default connect(mapDispatchToProps)(LogIn)

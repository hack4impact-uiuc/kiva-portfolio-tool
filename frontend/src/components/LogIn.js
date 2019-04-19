import { Link } from 'react-router-dom'
import { login } from '../api/login'
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

import '../styles/index.css'

import b1 from '../media/b1.jpg'
import b2 from '../media/b2.jpg'
import b3 from '../media/b3.jpg'
import b4 from '../media/b4.jpg'
import b5 from '../media/b5.jpg'
import b6 from '../media/b6.jpg'
import b7 from '../media/b7.jpg'
import b8 from '../media/b8.jpg'
import b9 from '../media/b9.jpg'
import b10 from '../media/b10.jpg'
import b11 from '../media/b11.jpg'
import kivaLogo from '../media/kivaPlainLogo.png'

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
    //const resp = await result.json()
    console.log(result)
    /*
    if (!resp.token) {
      this.setState({ errorMessage: resp.message })
    } else {
      setCookie('token', resp.token)
      this.props.history.push('/dashboard')
    }
    */
  }

  render() {
    return (
      <div>
        <div id = "background">
          <BackgroundSlideshow images={[ b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11 ]} animationDelay={5000}/>
        </div>
        <div id = "foreground">
          <Card
            className="interview-card center-background"
            style={{ width: '400px', height: '60%' }}
          >
            <CardTitle>
              <img id = "foreground" src={kivaLogo} />
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
      </div>
    )
  }
}
export default connect(mapDispatchToProps)(LogIn)

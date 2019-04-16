import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { register } from '../utils/api'
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {

    },
    dispatch
  )
}

// michael's baby
const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"


class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      password2: '',
      errorMessage: ''
    }
  }

  handleChange = event => {
    const value = event.target.value
    const name = event.target.name
    this.setState({ [name]: value })
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (this.state.password === this.state.password2) {
      console.log("passwords match!")
      const result = await register(this.state.email, this.state.password)
      const response = await result.json()
      console.log(response)
      if (!response.token) {
        this.setState({ errorMessage: response.message })
      } else {
        setCookie('token', response.token)
        this.props.history.push('/login')
        //Router.push('/')
      }
    } else {
      this.setState({ errorMessage: 'Passwords do not match' })
    }
  }

  render = () => (
    <div>
      <Card className="interview-card" style={{ width: '400px', height: '60%' }}>
        <CardTitle>
          <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>Register</h3>
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
              onClick={() => this.props.history.push('/dashboard')}
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
  )
}

export default connect(mapDispatchToProps)(Register)
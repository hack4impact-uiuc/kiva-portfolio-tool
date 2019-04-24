import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { register } from '../utils/ApiWrapper'
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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { setCookie } from './../utils/cookie'
import { setUserRole } from '../redux/modules/user'

const mapStateToProps = state => ({
  role: state.user.role
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setUserRole
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

    this.toggle = this.toggle.bind(this)
    this.state = {
      email: '',
      password: '',
      password2: '',
      errorMessage: '',
      dropdownOpen: false,
      selected: "Role"
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  handleClick = event => {
      this.setState({ selected: event.target.innerText})
      this.props.setUserRole( event.target.innerText )
  }

  handleChange = event => {
    const value = event.target.value
    const name = event.target.name
    this.setState({ [name]: value })
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (this.state.password === this.state.password2) {
      const result = await register(this.state.email, this.state.password)
      const response = await result.json
      if (!response.token) {
        this.setState({ errorMessage: response.message })
      } else {
        console.log("Account successfully created")
        setCookie('token', response.token)
        this.props.history.push('/login')
      }
    } else {
      this.setState({ errorMessage: 'Passwords do not match' })
    }
  }

  render = () => (
    <div>
      <Card className="interview-card center-background" style={{ width: '400px', height: '60%' }}>
        <CardTitle>
          <h3 style={{ textAlign: 'center', paddingTop: '10px' }}>Register</h3>
        </CardTitle>

        <CardBody style={{margin: '30px'}}>
          <Form>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="E-mail"
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
                minLength="8"
                maxLength="64"
                value={this.state.password2}
                onChange={this.handleChange}
                required
              />
            </FormGroup>
            <h6> Registering up as:</h6>
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret color="success">
                {this.props.role}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.handleClick}>Admin</DropdownItem>
                <DropdownItem onClick={this.handleClick}>PM</DropdownItem>
                <DropdownItem onClick={this.handleClick}>FP</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <br />
            <br />
            <br />
            <br />
            <br />
            <Button
              color="success"
              size="lg"
              onClick={this.handleSubmit}
              style={{ float: 'left', width: '44%' }}
            >
              Register
            </Button>{' '}
            <Button
              color="success"
              size="lg"
              onClick={() => this.props.history.push('/dashboard')}
              style={{ float: 'right', width: '44%' }}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Register)

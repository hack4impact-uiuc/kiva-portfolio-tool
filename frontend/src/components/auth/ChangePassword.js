import React, { Component } from 'react'
import WithAuth from './WithAuth'
import Navbar from '../NavBar'
import { changePassword } from '../../utils/ApiWrapper'
import { Form, Button, FormGroup, Label, Input, CardTitle, Card, CardBody, Row } from 'reactstrap'
import { connect } from 'react-redux'
import { setCookie } from '../../utils/cookie'
import BackgroundSlideshow from 'react-background-slideshow'

import '../../styles/index.css'
import '../../styles/login.css'

import kivaLogo from '../../media/kivaPlainLogo.png'
import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'

class ChangePassword extends Component {
  state = {
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
    responseMessage: ''
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handlePassChange = async e => {
    e.preventDefault()
    if (this.state.newPassword1 === this.state.newPassword2) {
        const result = await changePassword(this.state.oldPassword, this.state.newPassword1)
        if (result.error != null && (result.error.response.status === 400 || result.error.response.status === 500)) {
            this.setState({
              responseMessage: result.error.response.data.message
            })
            return
        }

        let token = result.response.data.result.token
        setCookie('token', token)
    } else {
      this.setState({ responseMessage: 'Passwords do not match' })
    }
  }

  render() {
    return (
      <div>
        <Navbar className="nav-absolute"/>
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
              <Form>
                <FormGroup>
                  <Input
                    name="oldPassword"
                    placeholder="Old Password"
                    type="password"
                    maxLength="128"
                    value={this.state.oldPassword}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="newPassword1"
                    placeholder="New Password"
                    type="password"
                    maxLength="128"
                    value={this.state.newPassword1}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="newPassword2"
                    placeholder="Confirm Password"
                    type="password"
                    maxLength="128"
                    value={this.state.newPassword2}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
                <Button
                  color="success"
                  size="lg"
                  onClick={this.handlePassChange}
                  className="left left-margin-lg"
                >
                  Change Password
                </Button>
                <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/')}
                    className="right"
                  >
                    Back To LogIn
                  </Button>
              </Form>
              <p style={{ color: 'red' }}>
                {this.state.responseMessage ? this.state.responseMessage : ''}
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

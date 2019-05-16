import { Link } from 'react-router-dom'
import { login, getPartnersByStatus, verify, getFPByEmail, getPMByEmail } from '../utils/ApiWrapper'
import { bindActionCreators } from 'redux'
import { Form, Button, FormGroup, Input, Card, CardBody } from 'reactstrap'
import { setCookie } from './../utils/cookie'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import BackgroundSlideshow from 'react-background-slideshow'
import Navbar from './NavBar'

import '../styles/index.css'
import '../styles/login.css'
import '../styles/navbar.css'

import b1 from '../media/b1-min.jpg'
import b3 from '../media/b3-min.jpg'
import b4 from '../media/b4-min.jpg'
import b5 from '../media/b5-min.jpg'
import b6 from '../media/b6-min.jpg'
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
    username: '',
    wrongInfo: false,
    fp_id: null
  }

  async componentDidMount() {
    const fps = await getPartnersByStatus('In Process')
    //use first FP temporarily until auth integration
    this.setState({ fp_id: fps[0]._id })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const result = await login(this.state.email, this.state.password)
    if (
      result.error != null &&
      (result.error.response.status === 400 || result.error.response.status === 500)
    ) {
      console.log(result.error.response.message)
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.error.response.data.message
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
      let role = await verify()
      console.log(role)
      if (role.error) {
        this.props.history.push('/oops')
      } else {
        role = role.response.data.result.role

        if (role == 'fp') {
          let fp = await getFPByEmail(this.state.email)
          this.props.history.push('/dashboard/fp/' + fp._id)
        } else {
          let pm = await getPMByEmail(this.state.email)
          this.props.history.push('/main/' + pm._id)
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Navbar className="nav-absolute" />
        <div className="background">
          <BackgroundSlideshow images={[b1, b3, b4, b5, b6]} animationDelay={5000} />
        </div>
        <div className="foreground">
          <Card className="interview-card center-background">
            <CardBody>
              <div className="text-centered" id="login-kiva-logo">
                <img src={kivaLogo} alt="Kiva logo" />
              </div>
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
                <div className="text-centered">
                  <Button color="success" size="lg" onClick={this.handleSubmit} className="right">
                    Log In
                  </Button>
                  {''}
                  <Button
                    color="success"
                    size="lg"
                    onClick={() => this.props.history.push('/register')}
                    className="left left-margin-lg"
                  >
                    Register
                  </Button>
                </div>
              </Form>
              <p style={{ color: 'red' }}>
                {this.state.errorMessage ? this.state.errorMessage : ''}
              </p>
              <Link
                id="forgot"
                className="text-centered margin-center"
                to="/forgotPassword"
                prefetch
                href="/forgotPassword"
              >
                Forgot Password?
              </Link>
              <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
            </CardBody>
          </Card>
          <br />
        </div>
      </div>
    )
  }
}
export default connect(mapDispatchToProps)(LogIn)

import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { Form, Button, FormGroup, Input, Card, Alert, CardBody, CardTitle } from 'reactstrap'
import BackgroundSlideshow from 'react-background-slideshow'

import { connect } from 'react-redux'

import Navbar from '../NavBar'

import {
  getSecurityQuestionForUser,
  submitSecurityQuestionAnswer,
  resetPassword
} from '../../utils/ApiWrapper'
import { setCookie } from '../../utils/cookie'

import kivaLogo from '../../media/kivaPlainLogo.png'
import b1 from '../../media/b1-min.jpg'
import b3 from '../../media/b3-min.jpg'
import b4 from '../../media/b4-min.jpg'
import b5 from '../../media/b5-min.jpg'
import b6 from '../../media/b6-min.jpg'

import '../../styles/index.css'
import '../../styles/login.css'

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})"

const mapStateToProps = state => ({
  language: state.user.language
})

/**
 * This Component handles the case where a user forgets their password
 * It contains a form to take in any information required for the user to reset their password
 * It is a multi-step recovery system
 * It has a button to return back to the login page
 */
export class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      question: '',
      errorMessage: '',
      answer: '',
      pin: '',
      password: '',
      password2: '',
      loadingAPI: false,
      submitNewPassword: false
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleGetSecurityQuestion = async e => {
    e.preventDefault()
    const result = await getSecurityQuestionForUser(this.state.email)

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong email!'
      })
      return
    }

    let question = result.response.data.result.question

    if (!question) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: result.response.message
      })
    } else {
      this.setState({
        wrongInfo: !this.state.wrongInfo
      })
      this.setState({ question: question, errorMessage: '' })
    }
  }

  handleSubmitSecurityAnswer = async e => {
    e.preventDefault()

    this.setState({ loadingAPI: true })
    const result = await submitSecurityQuestionAnswer(this.state.email, this.state.answer)

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong answer!',
        loadingAPI: false
      })
      return
    }
    this.setState({ submitNewPassword: true, errorMessage: '' })
  }

  handleSubmitNewPassword = async e => {
    e.preventDefault()
    if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: "Passwords don't match!" })
      return
    }
    const result = await resetPassword(
      this.state.email,
      this.state.answer,
      this.state.pin,
      this.state.password
    )

    if (result == null) {
      this.setState({
        wrongInfo: !this.state.wrongInfo,
        errorMessage: 'Wrong input!'
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
      this.setState({ successfulSubmit: true })
      this.props.history.push('/')
    }
  }

  languages = {
    English: {
      pin: 'PIN',
      password: 'Password',
      confirm: 'Confirm password',
      reset: 'Reset password',
      back: 'Back to login page',
      email: 'Email',
      getSecurityQuestion: 'Get security question',
      answer: 'Answer',
      submit: 'Submit answer'
    },
    Spanish: {
      pin: 'PIN (código de acceso)',
      password: 'Contraseña',
      confirm: 'Confirme tu contraseña',
      reset: 'Restablecer tu contraseña',
      back: 'Regresar a la pagina de acceso',
      email: 'Correo electronico',
      getSecurityQuestion: 'Conseguir la pregunta de seguridad',
      answer: 'Respuesta',
      submit: 'Enviar respuesta'
    },
    French: {
      pin: "PIN (code d'accès)",
      password: 'Mot de passe',
      confirm: 'Confirmer mot de passe',
      reset: 'Réinitialiser mot de passe',
      back: "Retour à la page d'identification",
      email: 'Courrier électronique',
      getSecurityQuestion: 'Recevoir question de sécurité',
      answer: 'Réponse',
      submit: 'Envoyer réponse'
    },
    Portuguese: {
      pin: 'PIN (código de acceso)',
      password: 'Senha',
      confirm: 'Confirmar senha',
      reset: 'Redefinir senha',
      back: 'Voltar à página de acesso',
      email: 'Email',
      getSecurityQuestion: 'Receber a pergunta de segurança',
      answer: 'Resposta',
      submit: 'Enviar resposta'
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
        {this.state.errorMessage !== '' && <Alert color="danger">{this.state.errorMessage}</Alert>}
        {this.state.submitNewPassword ? (
          <div className="foreground">
            <Card className="interview-card">
              <CardTitle>
                <div className="text-centered" id="login-kiva-logo">
                  <img src={kivaLogo} alt="Kiva logo" />
                </div>
              </CardTitle>

              <CardBody>
                <Form onSubmit={this.handleSubmitNewPassword}>
                  <FormGroup>
                    <Input
                      name="pin"
                      placeholder={text.pin}
                      id="examplePin"
                      value={this.state.pin}
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password"
                      placeholder={text.password}
                      id="examplePassword"
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
                      onClick={this.handleSubmitNewPassword}
                      className="right"
                    >
                      {text.reset}
                    </Button>{' '}
                  </div>
                </Form>
              </CardBody>
              <div style={{ textAlign: 'center' }}>
                <Link to="/login">{text.back}</Link>
              </div>
            </Card>
          </div>
        ) : (
          <div className="foreground">
            {this.state.question === '' ? (
              <Card className="interview-card">
                <CardTitle>
                  <div className="text-centered" id="login-kiva-logo">
                    <img src={kivaLogo} alt="Kiva logo" />
                  </div>
                </CardTitle>

                <CardBody>
                  <Form onSubmit={this.handleGetSecurityQuestion}>
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
                    <div className="text-centered">
                      <Button
                        type="submit"
                        color="success"
                        size="lg"
                        onClick={this.handleGetSecurityQuestion}
                        className="right"
                      >
                        {text.getSecurityQuestion}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
                <div style={{ textAlign: 'center' }}>
                  <Link to="/login">{text.back}</Link>
                </div>
              </Card>
            ) : (
              <Card className="interview-card">
                <CardTitle>
                  <div className="text-centered" id="login-kiva-logo">
                    <img src={kivaLogo} alt="Kiva logo" />
                  </div>
                </CardTitle>

                <CardBody>
                  <Form onSubmit={this.handleSubmitSecurityAnswer}>
                    <FormGroup>
                      <p> {this.state.question}</p>
                      <Input
                        type="answer"
                        name="answer"
                        placeholder={text.answer}
                        id="exampleAnswer"
                        onChange={this.handleChange}
                        required
                      />
                    </FormGroup>
                    <div className="text-centered">
                      <Button
                        type="submit"
                        color="success"
                        size="lg"
                        onClick={this.handleSubmitSecurityAnswer}
                        className="right"
                        disabled={this.state.loadingAPI}
                      >
                        {text.submit}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
                <div style={{ textAlign: 'center' }}>
                  <Link to="/login">{text.back}</Link>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    )
  }
}
export default connect(mapStateToProps)(ForgotPassword)

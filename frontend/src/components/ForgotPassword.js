import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import {
  getSecurityQuestion,
  submitSecurityQuestionAnswer,
  resetPassword
} from "../utils/api";
import {
  Form,
  Button,
  FormGroup,
  Label,
  Input,
  Card,
  Alert,
  CardBody,
  CardTitle
} from "reactstrap";
import { connect } from 'react-redux'
import { setCookie } from "../utils/cookie";

const EMAIL_REGEX =
  "([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+).([a-zA-Z]{2,3}).?([a-zA-Z]{0,3})";
// const PASSWORD_REGEX = "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})";

class ForgotPassword extends Component {
  state = {
    email: "",
    question: "",
    errorMessage: "",
    answer: "",
    pin: "",
    password: "",
    password2: "",
    loadingAPI: false,
    submitNewPassword: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleGetSecurityQuestion = async e => {
    e.preventDefault();

    const result = await getSecurityQuestion(this.state.email);
    const resp = await result.json();
    if (resp.status === 200) {
      this.setState({ question: resp.question, errorMessage: "" });
    } else {
      this.setState({ errorMessage: resp.message });
    }
  };

  handleSubmitSecurityAnswer = async e => {
    e.preventDefault();

    this.setState({ loadingAPI: true });
    const result = await submitSecurityQuestionAnswer(
      this.state.email,
      this.state.answer
    );
    const resp = await result.json();
    this.setState({ loadingAPI: false });
    if (resp.status === 200) {
      this.setState({ submitNewPassword: true, errorMessage: "" });
    } else {
      this.setState({ errorMessage: resp.message });
    }
  };

  handleSubmitNewPassword = async e => {
    e.preventDefault();
    if (this.state.password !== this.state.password2) {
      this.setState({ errorMessage: "Passwords don't match!" });
      return;
    }
    const response = await (await resetPassword(
      this.state.pin,
      this.state.email,
      this.state.password,
      this.state.answer
    )).json();
    if (response.status === 200 && response.token) {
      setCookie("token", response.token);
      this.setState({ successfulSubmit: true });
      this.props.history.push('/')
    } else {
      this.setState({ errorMessage: response.message });
    }
  };

  render = () => (
    <div>
      {this.state.errorMessage !== "" && (
        <Alert color="danger">{this.state.errorMessage}</Alert>
      )}
      {this.state.submitNewPassword ? (
        <Card
          className="interview-card"
          style={{ width: "400px", height: "60%" }}
        >
          <CardTitle>
            <h3 style={{ textAlign: "center", paddingTop: "10px" }}>
              Reset Password
            </h3>
          </CardTitle>

          <CardBody>
            <Form>
              <FormGroup>
                <Label>Pin</Label>
                <Input
                  name="pin"
                  value={this.state.pin}
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
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
                <Label>Confirm Password</Label>
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
                onClick={this.handleSubmitNewPassword}
                style={{ float: "left", width: "100%" }}
              >
                Reset Password
              </Button>{" "}
            </Form>
          </CardBody>
          <div style={{ textAlign: "center" }}>
            <Link to='/login' prefetch href="/login">
              <a>Back to login page</a>
            </Link>
          </div>
        </Card>
      ) : (
        <div>
          {this.state.question === "" ? (
            <Card
              className="interview-card"
              style={{ width: "400px", height: "60%" }}
            >
              <CardTitle>
                <h3 style={{ textAlign: "center", paddingTop: "10px" }}>
                  Reset Password
                </h3>
              </CardTitle>

              <CardBody>
                <Form>
                  <FormGroup>
                    <Label>Email</Label>
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
                  <Button
                    color="success"
                    size="lg"
                    onClick={this.handleGetSecurityQuestion}
                    style={{ float: "right", width: "100%" }}
                  >
                    Reset Password
                  </Button>
                </Form>
              </CardBody>
              <div style={{ textAlign: "center" }}>
                <Link to='/login' prefetch href="/login">
                  <a>Back to login page</a>
                </Link>
              </div>
            </Card>
          ) : (
            <Card
              className="interview-card"
              style={{ width: "400px", height: "60%" }}
            >
              <CardTitle>
                <h3 style={{ textAlign: "center", paddingTop: "10px" }}>
                  Reset Password
                </h3>
              </CardTitle>

              <CardBody>
                <Form>
                  <FormGroup>
                    <p> {this.state.question}</p>
                    <Label>Answer</Label>
                    <Input
                      type="answer"
                      name="answer"
                      onChange={this.handleChange}
                      required
                    />
                  </FormGroup>
                  <Button
                    color="success"
                    size="lg"
                    onClick={this.handleSubmitSecurityAnswer}
                    style={{ float: "right", width: "100%" }}
                    disabled={this.state.loadingAPI}
                  >
                    Submit Answer
                  </Button>
                </Form>
              </CardBody>
              <div style={{ textAlign: "center" }}>
                <Link to='/login' prefetch href="/login">
                  <a>Back to login page</a>
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
export default connect()(ForgotPassword);
import React, { Component } from 'react';
import { Alert, Row, Col, Form,
         FormField, FormInput, 
         Button } from 'elemental';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEmail: '',
      inputPassword: '',
      inputCode: '',
      validated: true,
      imageCode: 'favicon.ico',
      infoMessage: '',
      errorMessage: ''
    };

    var self = this;

    fetch('/register-otp', { method: 'POST', mode: 'cors'})
      .then((response) => {
        return response.text()
      })
      .then((imgCode) => {
        self.setState({ imageCode: imgCode })
      })
  }

  componentDidMount() {
  }

  login() {
    var self = this;

    fetch('/login', 
      { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        mode: 'cors', 
        body: JSON.stringify({
          email: self.state.inputEmail,
          password: self.state.inputPassword,
          userToken: self.state.inputCode
        })})
      .then((response) => {
        if (response.status === 401) {
          return response.text().then((err) => {
            throw new Error(err)
          })
        }
        return response.text()
      })
      .then((result) => {
        console.log(self)
        self.setState({ infoMessage: result, errorMessage: '' })
      })
      .catch((err) => {
        console.log(self.state)
        self.setState({ errorMessage: err.message, infoMessage: '' })
      })
  }

  render() {
    var self = this;

    function updateEmail(e) {
      self.setState({ inputEmail: e.target.value, validated: (self.state.inputEmail.length > 0 && self.state.inputPassword.length > 0 && self.state.inputCode.length === 6) });
    }

    function updatePassword(e) {
      self.setState({ inputPassword: e.target.value, validated: (self.state.inputEmail.length > 0 && self.state.inputPassword.length > 0 && self.state.inputCode.length === 6) });
    }

    function updateInputCode(e) {
      self.setState({ inputCode: e.target.value, validated: (self.state.inputEmail.length > 0 && self.state.inputPassword.length > 0 && e.target.value.length === 6) });
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <code>Username is 'tester@test.com', password is 'test'. Scan the right to setup.</code>
        </p>
        { this.state.infoMessage !== '' && <Alert type="success"><strong>{ this.state.infoMessage }</strong></Alert> }
        { this.state.errorMessage !== '' &&  <Alert type="danger"><strong>{ this.state.errorMessage }</strong></Alert> }
        <Row>
          <Col sm="2/3">
            <Form type="horizontal">
              <FormField id="email" label="Email address" htmlFor="horizontal-form-input-email">
                <FormInput value={this.inputEmail} onChange={updateEmail} type="email" placeholder="Enter email" name="horizontal-form-input-email" />
              </FormField>
              <FormField id="password" label="Password" htmlFor="horizontal-form-input-password">
                <FormInput value={this.inputPassword} onChange={updatePassword} type="password" placeholder="Password" name="horizontal-form-input-password" />
              </FormField>
              <FormField id="inputCode" label="OTP code">
                <FormInput value={this.inputCode} onChange={updateInputCode} type="number" placeholder="Input OTP code here" name="horizontal-form-input-otp" />
              </FormField>
              <FormField offsetAbsentLabel>
                <Button disabled={!self.state.validated} onClick={this.login.bind(this)}>Submit</Button>
              </FormField>
            </Form>
          </Col>
          <Col sm="1/3">
            <img id="qrCode" alt="" src={this.state.imageCode}/>
            <p>
              Scan the above with Google Authenticator or FreeOTP to sync
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;

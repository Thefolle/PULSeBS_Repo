import React from 'react';

import Redirect from 'react-router-dom/Redirect';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

import API from './API/API';

import 'bootstrap/dist/css/bootstrap.min.css';
import './customStyle.css';

class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = { email: '', password: '', redirect: false, invalidCredentials: false, userType: undefined };
    }
  
    isEmailInvalid(email) {
      if (!email.localeCompare('')) return undefined;
      else return !email.includes('@');
    }
  
    login() {
  
      API.login(this.state.email, this.state.password).then((user) => {
        this.props.setFullName(user.name, user.surname, user.type);
  
        this.setState({ redirect: true, invalidCredentials: false, userType: user.type });
      }).catch((err) => {
        console.log(err);
        this.setState({ redirect: false, invalidCredentials: true });
      });
  
    }
  
    render() {
  
      return <>
        {this.state.redirect ? <Redirect to={{ pathname: this.state.userType === 0 ? '/StudentHome' : this.state.userType === 1 ? '/TeacherHome' : '/StaffHome' }} /> : undefined}
        <Form id='loginForm'>
          <header><h1>Login</h1></header>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="text" placeholder="Enter email" isInvalid={this.isEmailInvalid(this.state.email)} onChange={event => this.setState({ email: event.target.value })} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
              </Form.Text>
          </Form.Group>
  
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={event => this.setState({ password: event.target.value })} />
          </Form.Group>
          {!this.state.invalidCredentials ? undefined :
            <Jumbotron className='error'><p>Invalid email or password.</p></Jumbotron>
          }
          <Button variant="primary" disabled={!this.state.email.includes('@') || this.state.password.length === 0} onClick={event => this.login()}>Log in</Button>
        </Form>
      </>;
    }
}

export default LoginPage;
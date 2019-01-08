import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import EmailSent from '../email/EmailSent';
import {
  validateUsername,
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from 'utils/validation';
import logo from 'images/logo.png';
import { green, grey } from 'constants/Colours';

const styles = {
  viewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  container: {
    margin: '40px auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  title: {
    fontSize: 40,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 17,
    color: grey,
    marginTop: 10,
  },
  formContainer: {
    display: 'flex',
    margin: 'auto',
    marginTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 40,
  },
  body: {
    width: '100%',
    flex: 1,
  },
  registerButton: {
    width: '100%'
  },
  registerText: {
    color: 'white',
  },
  privacy: {
    marginTop: 10,
    fontSize: 14,
    color: grey,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  loadingIcon: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  registerButtonWrapper: {
    marginTop: 20,
    position: 'relative'
  }
};

export default class Register extends Component {

  state = {
    registered: false,
    loading: false,
    usernameError: '',
    nameError: '',
    emailError: '',
    passwordError: '',
  }

  removeErrors = () => {
    this.setState({
      usernameError: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    });
  }

  onRegister = async (ev) => {
    ev.preventDefault();
    const username = this.refs.username.getValue();
    const name = this.refs.name.getValue();
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    const confirmPassword = this.refs.confirmPassword.getValue();

    const errors = {
      usernameError: validateUsername(username),
      nameError: validateName(name),
      emailError: validateEmail(email),
      passwordError: validatePassword(password),
      confirmPasswordError: validateConfirmPassword(password, confirmPassword),
    };

    for (let key in errors) {
      if (errors[key].length > 0) {
        this.setState(errors);
        return;
      }
    }

    this.setState({
      loading: true
    });

    try {
      const response = await fetch('/server/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          name,
          email,
          password,
        }),
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          'x-secret': process.env.REACT_APP_SERVER_SECRET
        }
      });

      if (!response.ok) {
        const { code } = await response.json();
        const ERROR_USERNAME_EXISTS = 100;
        const ERROR_EMAIL_EXISTS = 200;
        const ERROR_SERVER_ERROR = 400;

        this.setState({ loading: false });

        switch (code) {
        case ERROR_USERNAME_EXISTS:
          this.setState({ usernameError: 'Username already exists' });
          return;
        case ERROR_EMAIL_EXISTS:
          this.setState({ emailError: 'Email already exists' });
          return;
        case ERROR_SERVER_ERROR:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        default:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        }
      } else {
        this.setState({ registered: true, loading: false });
      }
    } catch (err) {
      toast.error('Failed to create account. Please contact an administrator.');
      console.error(err);
    }
  }

  render() {
    if (this.state.registered) return <EmailSent />;
    return  (
      <div style={ styles.viewContainer }>
        <div style={ styles.container }>
          <div style={ styles.header }>
            <img src={ logo } alt="logo" style={ styles.logo } />
            <span style={ styles.title }>Hey there!</span>
            <span style={ styles.subtitle }>Sign up to begin organizing your courses.</span>
          </div>
          <Paper style={ styles.formContainer } zDepth={ 2 } rounded={ false }>
            <form style={ styles.body }>
              <TextField
                hintText="e.g. Ferigoose123"
                floatingLabelText="Username"
                errorText={ this.state.usernameError }
                onChange={ this.removeErrors }
                ref="username"
              /><br />
              <TextField
                hintText="e.g. Feridun Hamdullahpur"
                floatingLabelText="Full Name"
                errorText={ this.state.nameError }
                onChange={ this.removeErrors }
                ref="name"
              /><br />
              <TextField
                hintText="e.g. feridun@edu.uwaterloo.ca"
                floatingLabelText="Email"
                errorText={ this.state.emailError }
                onChange={ this.removeErrors }
                ref="email"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Password"
                type="password"
                errorText={ this.state.passwordError }
                onChange={ this.removeErrors }
                ref="password"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Confirm Password"
                type="password"
                errorText={ this.state.confirmPasswordError }
                onChange={ this.removeErrors }
                ref="confirmPassword"
              /><br />
              <div style={ styles.registerButtonWrapper }>
                <RaisedButton
                  label="Sign up"
                  backgroundColor={  green  }
                  style={ styles.registerButton }
                  labelStyle={ styles.registerText }
                  onClick={ this.onRegister }
                  disabled={ this.state.loading }
                  type="submit"
                />
                {this.state.loading &&
                  <CircularProgress size={ 24 } style={ styles.loadingIcon } />
                }
              </div>
            </form>
          </Paper>
          <div style={ styles.privacy }>
            <span>By signing up, you agree to our <a href="/privacy-policy">Privacy Policy</a>.</span>
          </div>
          <div style={ styles.footer }>
            Already have an account yet? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }
}

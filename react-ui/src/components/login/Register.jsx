import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setUser } from '../../actions';
import {
  validateUsername,
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateBetaKey,
} from '../../utils/validation';

const styles = {
  viewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  container: {
    margin: '60px auto',
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
    color: '#888e99',
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
    width: '100%',
    marginTop: 20,
  },
  registerText: {
    color: 'white',
  },
  privacy: {
    marginTop: 10,
    fontSize: 14,
    color: '#888e99',
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  }
};

class Register extends Component {

  static propTypes = {
    onSetUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      usernameError: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      keyError: '',
    }

    this.removeErrors = this.removeErrors.bind(this);
    this.onRegister = this.onRegister.bind(this);
  }

  removeErrors() {
    this.setState({
      usernameError: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      keyError: '',
    });
  }

  async onRegister(ev) {
    ev.preventDefault();
    const username = this.refs.username.getValue();
    const name = this.refs.name.getValue();
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    const confirmPassword = this.refs.confirmPassword.getValue();
    const key = this.refs.key.getValue();

    const errors = {
      usernameError: validateUsername(username),
      nameError: validateName(name),
      emailError: validateEmail(email),
      passwordError: validatePassword(password),
      confirmPasswordError: validateConfirmPassword(password, confirmPassword),
      keyError: validateBetaKey(key),
    };
    for (let key in errors) {
      if (errors[key].length > 0) {
        this.setState({ errors });
        return;
      }
    }

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
        const ERROR_SERVER_ERROR = 400;

        switch (code) {
          case ERROR_USERNAME_EXISTS:
            this.setState({ usernameError: 'Username already exists' });
            return;
          case ERROR_SERVER_ERROR:
            alert('Failed to create account. Please contact an administrator.');
            return;
          default:
            alert('Failed to create account. Please contact an administrator.');
            return;
        }
      } else {
        const user = await response.json();
        this.props.onSetUser(username, user);
        this.props.history.push("/");
      }
    } catch (err) {
      alert('Failed to create account. Please contact an administrator.');
      console.error(err);
    }
  }

  render() {
    return  (
      <div style={styles.viewContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <img src="images/logo.png" alt="logo" style={styles.logo} />
            <span style={styles.title}>Hey there!</span>
            <span style={styles.subtitle}>Sign up to begin organizing your courses.</span>
          </div>
          <Paper style={styles.formContainer} zDepth={2} rounded={false}>
            <form style={styles.body}>
              <TextField
                hintText="e.g. Ferigoose123"
                floatingLabelText="Username"
                errorText={this.state.usernameError}
                onChange={this.removeErrors}
                ref="username"
              /><br />
              <TextField
                hintText="e.g. Feridun Hamdullahpur"
                floatingLabelText="Full Name"
                errorText={this.state.nameError}
                onChange={this.removeErrors}
                ref="name"
              /><br />
              <TextField
                hintText="e.g. feridun@edu.uwaterloo.ca"
                floatingLabelText="Email"
                errorText={this.state.emailError}
                onChange={this.removeErrors}
                ref="email"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Password"
                type="password"
                errorText={this.state.passwordError}
                onChange={this.removeErrors}
                ref="password"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Confirm Password"
                type="password"
                errorText={this.state.confirmPasswordError}
                onChange={this.removeErrors}
                ref="confirmPassword"
              /><br />
              <TextField
                floatingLabelText="Beta Access Key"
                errorText={this.state.keyError}
                onChange={this.removeErrors}
                ref="key"
              /><br />
              <RaisedButton
                label="Sign up"
                backgroundColor="#3ec16b"
                style={styles.registerButton}
                labelStyle={styles.registerText}
                onClick={this.onRegister}
                type="submit"
              />
            </form>
          </Paper>
          <div style={ styles.privacy }>
            <span>By signing up, you agree to our <a href="/privacy-policy">Privacy Policy</a>.</span>
          </div>
          <div style={styles.footer}>
            Already have an account yet? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetUser: (username, user) => {
    dispatch(setUser(username, user));
  }
});

export default connect(null, mapDispatchToProps)(Register);

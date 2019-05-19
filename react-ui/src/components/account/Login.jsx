import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { toast } from 'react-toastify';
import Paper from 'material-ui/Paper';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FacebookIcon from '../tools/FacebookIcon';
import logo from 'images/logo.png';
import { setUser } from 'actions';
import { white, green, grey } from 'constants/Colours';


const ERROR_USERNAME_NOT_FOUND = 101;
const ERROR_WRONG_PASSWORD = 105;
const ERROR_USER_NOT_VERIFIED = 107;
const ERROR_EMAIL_EXISTS = 200;
const ERROR_MISSING_FB_EMAIL = 205;
const ERROR_SERVER_ERROR = 400;

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
    width: 356,
  },
  body: {
    width: '100%',
    flex: 1,
  },
  loginButton: {
    width: '100%',
    marginTop: 20,
  },
  loginText: {
    color: white,
  },
  fbContainer: {
    display: 'inline-flex',
    flexDirection: 'column',
    marginTop: 20,
  },
  fbButton: {
    height: 40,
    borderRadius: 6,
    marginTop: 20,
  },
  fbInnerButton: {
    borderRadius: 6,
  },
  fbIcon: {
    width: 30,
    height: 30,
    marginBottom: 3,
  },
  fbText: {
    fontSize: 17,
    color: 'white',
    textTransform: 'none',
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  }
};

class Login extends Component {

  static propTypes = {
    onSetUser: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      usernameError: '',
      passwordError: '',
      password: '',
      username: '',
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  removeErrors() {
    this.setState({ usernameError: '', passwordError: '' });
  }

  async handleLogin(ev) {
    ev.preventDefault();
    const { username, password } = this.state;

    if (!username || !password) {
      const errMessage = 'This field is required';
      const errors = {}
      if (!username) errors.usernameError = errMessage;
      if (!password) errors.passwordError = errMessage;

      this.setState(errors);
      return;
    }

    try {
      const response = await fetch('/server/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        }),
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          'x-secret': process.env.REACT_APP_SERVER_SECRET
        }
      });
      if (!response.ok) {
        const { code } = await response.json();

        switch (code) {
        case ERROR_USERNAME_NOT_FOUND:
          this.setState({ usernameError: 'Username not found' });
          return;
        case ERROR_WRONG_PASSWORD:
          this.setState({ passwordError: 'Wrong password' });
          return;
        case ERROR_USER_NOT_VERIFIED:
          toast.error("Please verify your email.  We've sent you a verification email at the email you provided.");
          return;
        case ERROR_SERVER_ERROR:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        default:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        }
      } else {
        const user = await response.json();
        const to = this.props.location.state
          ? this.props.location.state.from || '/'
          : '/';
        this.props.history.push(to);
        this.props.onSetUser(username, user);
      }
    } catch (err) {
      toast.error('Failed to create account. Please contact an administrator.');
      console.error(err);
    }
  }

  async handleFacebookLogin(response) {
    const { accessToken } = response;

    try {
      const response = await fetch('/server/auth/facebook', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'x-secret': process.env.REACT_APP_SERVER_SECRET,
          'authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        const { code, message } = await response.json();
        switch (code) {
        case ERROR_EMAIL_EXISTS:
          toast.error(message);
          return;
        case ERROR_MISSING_FB_EMAIL:
          toast.error(message);
          return;
        case ERROR_SERVER_ERROR:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        default:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        }
      } else {
        const { username, user } = await response.json();
        const to = this.props.location.state
          ? this.props.location.state.from || '/'
          : '/';
        this.props.history.push(to);
        this.props.onSetUser(username, user);
      }
    } catch (err) {
      toast.error('Login failed. Please contact an administrator.');
      console.error(err);
    }
  }

  handleInputChange = (e) => {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
    this.removeErrors();
  }

  render() {

    const { username, password, usernameError, passwordError } = this.state;
    const isUsernameError = usernameError !== '';
    const isPasswordError = passwordError !== '';

    return  (
      <div style={ styles.viewContainer }>
        <div style={ styles.container }>
          <div style={ styles.header }>
            <img src={ logo } alt="logo" style={ styles.logo } />
            <span style={ styles.title }>Welcome back!</span>
            <span style={ styles.subtitle }>Log in to see your courses.</span>
          </div>
          <Paper style={ styles.formContainer } zDepth={ 2 } rounded={ false }>
            <form style={ styles.body }>
              <TextField
                name="username"
                value={ username }
                placeholder="e.g. Ferigoose123"
                label="Username"
                error={ isUsernameError }
                fullWidth
                margin="normal"
                helperText={ usernameError }
                onChange={ this.handleInputChange }
              /><br />
              <TextField
                name="password"
                value={ password }
                placeholder="*********"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={ isPasswordError }
                helperText={ passwordError ? passwordError : <Link to="/forgot-password">Forgot Password?</Link> }
                onChange={ this.handleInputChange }
              /><br />
              <RaisedButton
                label="Sign in"
                backgroundColor={ green }
                style={ styles.loginButton }
                labelStyle={ styles.loginText }
                onClick={ this.handleLogin }
                type="submit"
              />
            </form>
          </Paper>
          <div style={ styles.fbContainer }>
            <span style={ styles.subtitle }>or</span>
            <FacebookLogin
              appId={ process.env.REACT_APP_FACEBOOK_APP_ID }
              fields="name,email,picture"
              disableMobileRedirect
              callback={ this.handleFacebookLogin }
              onFailure={ err => console.error(err) }
              render={ renderProps => (
                <RaisedButton
                  label="Continue with Facebook"
                  onClick={ renderProps.onClick }
                  style={ styles.fbButton }
                  buttonStyle={ styles.fbInnerButton }
                  labelStyle={ styles.fbText }
                  backgroundColor="#3b5998"
                  icon={ <FacebookIcon style={ styles.fbIcon } />  }
                />
              )  }
            />
          </div>
          <div style={ styles.footer }>
            Don't have an account yet? <Link to="/register">Sign up</Link>
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

export default connect(null, mapDispatchToProps)(Login);

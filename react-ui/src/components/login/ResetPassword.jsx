import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import logo from 'images/logo.png';
import { setUser } from 'actions';
import { white, green, grey } from 'constants/Colours';
import {
  validatePassword,
  validateConfirmPassword,
} from 'utils/validation';
import { toast } from 'react-toastify';
import { getVerificationToken } from 'utils/strings';

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
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    marginBottom: 50,
  },
};
const defaultErrorState = { passwordError: '', confirmPasswordError: '', isPasswordError: false, isConfirmPasswordError: false, };

class ResetPassword extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {
    ...defaultErrorState,
    confirmPassword: '',
    password: '',
  }

  validateResetPassword = () => {
    const { password, confirmPassword } = this.state;
   
    const passwordError = validatePassword(password);
    if (passwordError) {
      return {
        err: { passwordError, isPasswordError: true, },
        password: null,
      };
    }

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) {
      return {
        err: { confirmPasswordError, isConfirmPasswordError: true, },
        password: null,
      };
    }

    return { err: null, password };
  }

  handleResetPassword = async (ev) => {
    ev.preventDefault();
    const { err, password } = this.validateResetPassword();
    if (err) {
      this.setState(err);
      return;
    }

    const { search: queryString } = this.props.location;
    const token = getVerificationToken(queryString);

    const response = await fetch(`/server/email/reset/password?token=${token}`, {
      method: 'POST',
      body: JSON.stringify({
        password
      }),
      headers: {
        'content-type': 'application/json',
        "x-secret": process.env.REACT_APP_SERVER_SECRET
      },
    });

    if (!response.ok) {
      const { code, message } = await response.json();
      const ERROR_RESET_PASSWORD_TOKEN = 202;
      const ERROR_SAME_PASSWORD = 203;

      switch (code) {
      case ERROR_RESET_PASSWORD_TOKEN:
        this.setState({ passwordError: message, isPasswordError: true, isConfirmPasswordError: true, });
        return;
      case ERROR_SAME_PASSWORD:
        this.setState({ passwordError: message, isPasswordError: true, isConfirmPasswordError: true, });
        return;
      default:
        toast.error('An error occured. Please contact an administrator.');
        return;
      }
    } else {
      this.setState({ willRedirect: true });
      setTimeout(this.redirect, 4000);
    }
  }

  redirect = () => {
    this.props.history.push('/login');
  }

  removeErrors = () => this.setState({ ...defaultErrorState })

  handleInputChange = (e) => {
    const { value: inputValue, name: inputName } = e.target;

    this.setState({
      [inputName]: inputValue
    });
    this.removeErrors();
  }

  renderResetPasswordForm = () => {
    const { password, confirmPassword, passwordError, confirmPasswordError, isPasswordError, isConfirmPasswordError } = this.state;
    return (
      <>
        <div style={ styles.header }>
          <img src={ logo } alt="logo" style={ styles.logo } />
          <span style={ styles.title }>Reset Your Password</span>
          <span style={ styles.subtitle }>Pick a new password</span>
        </div>
        <Paper style={ styles.formContainer } zDepth={ 2 } rounded={ false }>
          <form style={ styles.body }>
            <TextField
              name="password"
              value={ password }
              placeholder="*********"
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              error={ isPasswordError }
              helperText={ passwordError }
              onChange={ this.handleInputChange }
            /><br />
            <TextField
              name="confirmPassword"
              value={ confirmPassword }
              placeholder="*********"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              error={ isConfirmPasswordError }
              helperText={ confirmPasswordError }
              onChange={ this.handleInputChange }
            /><br />
            <RaisedButton
              label="Reset Password"
              backgroundColor={ green }
              style={ styles.loginButton }
              labelStyle={ styles.loginText }
              onClick={ this.handleResetPassword }
              type="submit"
            />
          </form>
        </Paper>
      </>
    );
  }

  renderSuccessMessage = () => (
    <>
      <div style={ styles.header }>
        <img src={ logo } alt="logo" style={ styles.logo } />
        <span style={ styles.title }>Password updated!</span>
        <span style={ styles.subtitle }>Please log in to your account to continue.</span>
      </div>
      <div style={ styles.loadingContainer }>
        <span style={ styles.subtitle }>Redirecting you to the login page...</span>
        <CircularProgress style={{ margin: 'auto' }} size={ 40 } thickness={ 3 } />
      </div>
      <span>If you're not redirected after 5 seconds, click <a href="/">here</a> to return to the login screen.</span>
    </>
  )

  render() {
    const { willRedirect } = this.state;

    return  (
      <div style={ styles.viewContainer }>
        <div style={ styles.container }>
          {
            willRedirect
              ? this.renderSuccessMessage()
              : this.renderResetPasswordForm()
          }
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

export default connect(null, mapDispatchToProps)(ResetPassword);

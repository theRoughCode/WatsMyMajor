import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import logo from 'images/logo.png';
import { setUser } from 'actions';
import { white, green, grey } from 'constants/Colours';
import { toast } from 'react-toastify';
import { validateEmail } from 'utils/validation';

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
  message: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
  }
};
const defaultErrorState = { emailError: '', isEmailError: false };
// const defaultErrorState = { emailError: 'error idk', isEmailError: true };

const emailSentMessage = `You should soon receive instructions to reset your password at the email you provided.`

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultErrorState,
      email: '',
      forgotPasswordEmailSent: false,
    }

    this.handleForgotPassword = this.handleForgotPassword.bind(this);
  }

  validateForgotPassword = () => {
    const { email } = this.state;
    const validateEmailErrors = validateEmail(email);
    if (validateEmailErrors) {
      return { err: { emailError: validateEmailErrors, isEmailError: true }, email: null };
    }

    return { err: null, email };
  }

  async handleForgotPassword(ev) {
    ev.preventDefault();
    const { err, email } = this.validateForgotPassword();
    if (err) {
      this.setState(err);
      return;
    }

    try {
      const response = await fetch('/server/auth/forgot', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          'x-secret': process.env.REACT_APP_SERVER_SECRET
        }
      });

      if (!response.ok) {
        const { code } = await response.json();
        const ERROR_EMAIL_NOT_FOUND = 201;

        switch (code) {
        case ERROR_EMAIL_NOT_FOUND:
          this.setState({ emailError: `Email doesn't exist`, isEmailError: true, });
          return;
        default:
          toast.error('Failed to create account. Please contact an administrator.');
          return;
        }
      } else {
        this.setState({ email: "", forgotPasswordEmailSent: true });
      }
    } catch (err) {
      toast.error('Failed to send reset email. Please contact an administrator.');
      console.error(err);
    }

  }

  removeErrors = () => this.setState({ emailError: '', isEmailError: false })

  handleInputChange = (e) => {
    const { value: inputVal, name: inputName } = e.target;
    

    this.setState({
      [inputName]: inputVal,
      ...defaultErrorState,
    });
  }

  renderEmailForm = () => {
    const { email, emailError, isEmailError } = this.state;
    return (
      <>
        <Paper style={ styles.formContainer } zDepth={ 2 } rounded={ false }>
          <form style={ styles.body }>
            <TextField
              name="email"
              value={ email }
              placeholder="e.g. feridun@edu.uwaterloo.ca"
              label="Email"
              error={ isEmailError }
              fullWidth
              margin="normal"
              helperText={ isEmailError && emailError }
              onChange={ this.handleInputChange }
            /><br />
            <RaisedButton
              label="Submit"
              backgroundColor={ green }
              style={ styles.loginButton }
              labelStyle={ styles.loginText }
              onClick={ this.handleForgotPassword }
              type="submit"
            />
          </form>
        </Paper>
        <div style={ styles.footer }>
          Don't have an account yet? <Link to="/register">Sign up</Link>
        </div>
      </>
    );
  }

  renderEmailSentMessage = () => (<span style={ styles.message }> {emailSentMessage} </span>)

  render() {
    const { forgotPasswordEmailSent } = this.state;

    return  (
      <div style={ styles.viewContainer }>
        <div style={ styles.container }>
          <div style={ styles.header }>
            <img src={ logo } alt="logo" style={ styles.logo } />
            <span style={ styles.title }>Forgot Password</span>
            <span style={ styles.subtitle }>Please enter your email to reset your password</span>
          </div>
          {
            forgotPasswordEmailSent
              ? this.renderEmailSentMessage()
              : this.renderEmailForm()
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

export default connect(null, mapDispatchToProps)(ForgotPassword);

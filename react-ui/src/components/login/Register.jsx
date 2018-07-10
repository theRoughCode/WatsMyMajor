import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { setUser } from '../../actions/index';

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
  footer: {
    marginTop: 40,
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
    const { usernameError, nameError, emailError, passwordError } = this.state;
    if (usernameError || nameError || emailError || passwordError) {
      this.setState({
        usernameError: '',
        nameError: '',
        emailError: '',
        passwordError: '',
        keyError: '',
      });
    }
  }

  onRegister(ev) {
    ev.preventDefault();
    const username = this.refs.username.getValue();
    const name = this.refs.name.getValue();
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    const key = this.refs.key.getValue();

    if (!username || !name || !email || !password || !key) {
      const errMessage = 'This field is required';
      const errors = {}
      if (!username) errors.usernameError = errMessage;
      if (!name) errors.nameError = errMessage;
      if (!email) errors.emailError = errMessage;
      if (!password) errors.passwordError = errMessage;
      if (!key) errors.keyError = errMessage;

      this.setState(errors);
      return;
    }

    if (key !== 'MRGOOSE') {
      this.setState({ keyError: 'Invalid beta key.' });
      return;
    }

    fetch('/users/auth/create', {
			method: 'POST',
			body: JSON.stringify({
				username,
        name,
        email,
        password,
			}),
			headers: {
	      'content-type': 'application/json'
	    }
		})
      .then(response => {
        console.log(response)
  			if (!response.ok) throw new Error(`status ${response.status}`);
  			else return response.json();
  		})
      .then(user => {
        this.props.onSetUser(username, user);
        this.props.history.push("/");
      })
      .catch(() => alert('Failed to create account. Please contact an administrator.'));
  }

  render() {
    return  (
      <div style={styles.viewContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <img src="images/logo.png" style={styles.logo} />
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

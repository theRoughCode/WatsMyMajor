import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  loginButton: {
    width: '100%',
    marginTop: 20,
  },
  loginText: {
    color: 'white',
  }
};

class Login extends Component {

  static propTypes = {
    onSetUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      usernameError: '',
      passwordError: ''
    }

    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    const username = this.refs.username.getValue();
    const password = this.refs.password.getValue();

    if (!username || !password) {
      const errMessage = 'This field is required';
      const errors = {}
      if (!username) errors.usernameError = errMessage;
      if (!password) errors.passwordError = errMessage;

      this.setState(errors);
      return;
    }

    fetch('/users/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
        password
			}),
			headers: {
	      'content-type': 'application/json'
	    }
		})
      .then(response => {
  			if (!response.ok) throw new Error(`status ${response.status}`);
  			return response.json();
  		})
      .then(user => {
        this.props.onSetUser(username, user);
        this.props.history.push("/");
      })
      .catch(() => alert('Incorrect username/password'));
  }

  render() {
    return  (
      <div style={styles.viewContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <img src="images/logo.png" style={styles.logo} />
            <span style={styles.title}>Welcome back!</span>
            <span style={styles.subtitle}>Log in to see your courses.</span>
          </div>
          <Paper style={styles.formContainer} zDepth={2} rounded={false}>
            <div style={styles.body}>
              <TextField
                hintText="e.g. Ferigoose123"
                floatingLabelText="Username"
                errorText={this.state.usernameError}
                ref="username"
              /><br />
              <TextField
                hintText="*********"
                floatingLabelText="Password"
                type="password"
                errorText={this.state.passwordError}
                ref="password"
              /><br />
              <RaisedButton
                label="Sign in"
                backgroundColor="#3ec16b"
                style={styles.loginButton}
                labelStyle={styles.loginText}
                onClick={this.onLogin}
              />
            </div>
          </Paper>
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

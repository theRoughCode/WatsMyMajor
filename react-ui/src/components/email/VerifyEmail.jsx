import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import logo from 'images/logo.png';
import { grey } from 'constants/Colours';
import { logoutUser } from 'actions';
import { getVerificationToken } from 'utils/strings';

const styles = {
  bigContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  smallContainer: {
    margin: 'auto',
    height: '60%',
  },
  error: {
    fontSize: 18,
  },
  verifiedContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 60,
    height: 60,
    margin: '20px auto',
  },
  verifiedTitle: {
    fontSize: 30,
    fontWeight: 500,
    marginBottom: 15,
  },
  verifiedSubtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: grey,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    marginBottom: 50,
  },
  loadingText: {
    marginBottom: 10,
  },
};


class VerifyEmail extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    error: false,
    loading: true,
  };

  async componentDidMount() {
    const { search: queryString } = this.props.location;
    const token = getVerificationToken(queryString);

    const response = await fetch(`/server/email/verify/user?token=${token}`, {
      headers: {
        "x-secret": process.env.REACT_APP_SERVER_SECRET
      }
    });
    if (!response.ok) {
      this.setState({ error: true, loading: false });
      return;
    }
    const { username } = await response.json();
    this.setState({ username, loading: false });
  }

  redirect = () => {
    this.props.logout();
    this.props.history.push('/login');
  }

  render() {
    if (this.state.loading) return null;

    // TODO: Add graphics to verification error message
    const view = (this.state.error || !this.state.username)
      ? (
        <span style={ styles.error }>
          Failed to verify email.  Please contact an administrator.<br />
          Click <a href="/">here</a> to return to the login screen.
        </span>
      )
      : (
        <div style={ styles.verifiedContainer }>
          <img src={ logo } alt="logo" style={ styles.logo } />
          <span style={ styles.verifiedTitle }>Welcome, { this.state.username }!</span>
          <span style={ styles.verifiedSubtitle }>Please log in to your account to continue.</span>
          <div style={ styles.loadingContainer }>
            <span style={ styles.loadingText }>Redirecting you to the login page...</span>
            <CircularProgress style={{ margin: 'auto' }} size={ 40 } thickness={ 3 } />
          </div>
          <span>If you're not redirected after 5 seconds, click <a href="/">here</a> to return to the login screen.</span>
        </div>
      );

    if (this.state.username.length > 0) {
      setTimeout(this.redirect, 4000);
    }

    return (
      <div style={ styles.bigContainer }>
        <div style={ styles.smallContainer }>
          { view }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () =>	dispatch(logoutUser()),
});

export default connect(null, mapDispatchToProps)(VerifyEmail);

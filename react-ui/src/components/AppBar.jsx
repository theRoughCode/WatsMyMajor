import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';
import logo from '../images/logo.png';
import { darkGrey, white, purple } from '../constants/Colours';

const styles = {
  container: (isWelcomeScreen) => ({
    backgroundColor: (isWelcomeScreen) ? white : purple,
    textAlign: 'left',
    position: 'fixed',
  }),
  buttonStyle: {
    marginTop: 11,
    marginLeft: 20
  },
  buttonLabel: (isWelcomeScreen) => ({
    color: (isWelcomeScreen) ? darkGrey : white,
  }),
  searchBar: {
    marginTop: '5px',
    width: '30%',
  },
  titleContainer: (isWelcomeScreen) => ({
    color: (isWelcomeScreen) ? darkGrey : white,
    cursor: 'pointer',
    fontWeight: 400,
    textDecoration: 'none',
  }),
  logo: {
    width: 35,
    height: 35,
    margin: 'auto 7px',
    marginRight: 10,
    verticalAlign: 'text-bottom',
  },
};

class AppBar extends Component {
  static propTypes = {
    toggleSideBar: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  onSearchResult = (subject, catalogNumber) => {
    this.props.history.push(`/courses/${subject}/${catalogNumber}`);
  }

  onLogin = () => {
    this.props.history.push('/login', { from: this.props.location.pathname });
  }

  onLogout = () => {
    this.props.history.push('/login');
    this.props.onLogout();
  }

  render() {
    const { toggleSideBar, isLoggedIn } = this.props;
    const isWelcomeScreen = (this.props.history.location.pathname === '/welcome');
    const button = (isLoggedIn)
      ? (
        <FlatButton
          label="Logout"
          onClick={ this.onLogout }
          labelStyle={ styles.buttonLabel(false) }
          style={ styles.buttonStyle }
        />
      )
      : (
        <FlatButton
          label="Login"
          onClick={ this.onLogin }
          labelStyle={ styles.buttonLabel(isWelcomeScreen) }
          style={ styles.buttonStyle }
        />
      );
    return (
      <Bar
        style={ styles.container(isWelcomeScreen) }
        onLeftIconButtonClick={ toggleSideBar }
        showMenuIconButton={ !isWelcomeScreen }
        zDepth={ (isWelcomeScreen) ? 0 : 1 }
        title={
          <Link to='/' style={ styles.titleContainer(isWelcomeScreen) }>
            <img src={ logo } alt="logo" style={ styles.logo } />
            <span>WatsMyMajor</span>
          </Link>
        }
      >
        <SearchBar onResult={ this.onSearchResult } style={ styles.searchBar } />
        { button }
      </Bar>
    );
  }
}

export default withRouter(AppBar);

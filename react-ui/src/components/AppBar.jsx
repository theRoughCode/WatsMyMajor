import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { withRouter, Link } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';
import logo from '../images/logo.png';
import { darkGrey, white, blueGreen, blueGreenHighlight } from '../constants/Colours';

const styles = {
  divContainer: {
    width: '100%',
    height: 64,
  },
  container: (isWelcomeScreen) => ({
    backgroundColor: (isWelcomeScreen) ? white : blueGreen,
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
    width: 400,
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

const mobileStyles = {
  titleContainer: (isWelcomeScreen) => ({
    cursor: 'pointer',
    width: 55,
    flex: 'none',
    marginRight: 24,
  }),
  searchBar: {
    marginTop: '5px',
    flex: 1,
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
    const hoverColor = (isWelcomeScreen) ? 'rgba(230, 230, 230, 0.8)' : blueGreenHighlight;
    const button = (isLoggedIn)
      ? (
        <FlatButton
          label="Logout"
          onClick={ this.onLogout }
          labelStyle={ styles.buttonLabel(false) }
          hoverColor={ blueGreenHighlight }
          style={ styles.buttonStyle }
        />
      )
      : (
        <FlatButton
          label="Login"
          onClick={ this.onLogin }
          labelStyle={ styles.buttonLabel(isWelcomeScreen) }
          hoverColor={ hoverColor }
          style={ styles.buttonStyle }
        />
      );
    return (
      <div style={ styles.divContainer }>
        <MediaQuery minDeviceWidth={ 768 }>
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
        </MediaQuery>
        <MediaQuery minDeviceWidth={ 530 } maxDeviceWidth={ 767 }>
          <Bar
            style={ styles.container(isWelcomeScreen) }
            titleStyle={ mobileStyles.titleContainer(isWelcomeScreen) }
            onLeftIconButtonClick={ toggleSideBar }
            showMenuIconButton={ !isWelcomeScreen }
            zDepth={ (isWelcomeScreen) ? 0 : 1 }
            title={
              <a href="/">
                <img src={ logo } alt="logo" style={ styles.logo } />
              </a>
            }
          >
            <SearchBar onResult={ this.onSearchResult } style={ mobileStyles.searchBar } />
            { button }
          </Bar>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={ 529 }>
          <Bar
            style={ styles.container(isWelcomeScreen) }
            titleStyle={ mobileStyles.titleContainer(isWelcomeScreen) }
            onLeftIconButtonClick={ toggleSideBar }
            showMenuIconButton={ !isWelcomeScreen }
            zDepth={ (isWelcomeScreen) ? 0 : 1 }
            title={
              <a href="/">
                <img src={ logo } alt="logo" style={ styles.logo } />
              </a>
            }
          >
            <SearchBar onResult={ this.onSearchResult } style={ mobileStyles.searchBar } />
          </Bar>
        </MediaQuery>
      </div>
    );
  }
}

export default withRouter(AppBar);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { withRouter, Link } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';
import LoginIcon from 'material-ui/svg-icons/action/open-in-browser';
import logo from '../images/logo.png';
import { darkGrey, white, blueGreen, blueGreenHighlight } from '../constants/Colours';

const styles = {
  divContainer: {
    width: '100%',
    height: 64,
  },
  container: (isWelcomeScreen) => ({
    backgroundColor: isWelcomeScreen ? white : blueGreen,
    textAlign: 'left',
    position: 'fixed',
  }),
  buttonStyle: {
    marginTop: 11,
    marginLeft: 20,
  },
  xsButtonStyle: {
    marginLeft: 20,
    marginTop: 11,
    minWidth: 'fit-content',
  },
  buttonLabel: (isWelcomeScreen) => ({
    color: isWelcomeScreen ? darkGrey : white,
  }),
  searchBar: {
    marginTop: '5px',
    width: 400,
  },
  titleContainer: (isWelcomeScreen) => ({
    color: isWelcomeScreen ? darkGrey : white,
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
  titleContainer: (isWelcomeScreen, expanded) => ({
    cursor: 'pointer',
    width: 'fit-content',
    flex: 'none',
    marginRight: expanded ? 0 : 15,
  }),
  searchBar: {
    marginTop: '5px',
    flex: 1,
  },
  logo: {
    width: 35,
    height: 35,
    margin: 0,
    marginRight: 5,
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

  state = {
    expanded: false,
  };

  onSearchResult = ({ subject, catalogNumber, id }) => {
    if (id != null) this.props.history.push(`/professors/${id}`);
    else this.props.history.push(`/courses/${subject}/${catalogNumber}`);
  };

  onLogin = () => {
    this.props.history.push('/login', { from: this.props.location.pathname });
  };

  onLogout = () => {
    this.props.history.push('/login');
    this.props.onLogout();
  };

  expandSearch = () => this.setState({ expanded: true });

  closeSearch = () => this.setState({ expanded: false });

  render() {
    const { toggleSideBar, isLoggedIn } = this.props;
    const { expanded } = this.state;
    const isWelcomeScreen = this.props.history.location.pathname === '/welcome';
    const hoverColor = isWelcomeScreen ? 'rgba(230, 230, 230, 0.8)' : blueGreenHighlight;
    const button = isLoggedIn ? (
      <FlatButton
        label="Logout"
        onClick={this.onLogout}
        labelStyle={styles.buttonLabel(false)}
        hoverColor={hoverColor}
        style={styles.buttonStyle}
      />
    ) : (
      <FlatButton
        label="Login"
        onClick={this.onLogin}
        labelStyle={styles.buttonLabel(isWelcomeScreen)}
        hoverColor={hoverColor}
        style={styles.buttonStyle}
      />
    );
    const xsButton = isLoggedIn ? (
      <FlatButton
        icon={<LogoutIcon color={isWelcomeScreen ? darkGrey : white} />}
        onClick={this.onLogout}
        hoverColor={hoverColor}
        style={styles.xsButtonStyle}
      />
    ) : (
      <FlatButton
        icon={<LoginIcon color={isWelcomeScreen ? darkGrey : white} />}
        onClick={this.onLogin}
        hoverColor={hoverColor}
        style={styles.xsButtonStyle}
      />
    );
    return (
      <div style={styles.divContainer}>
        <MediaQuery minWidth={800}>
          <Bar
            style={styles.container(isWelcomeScreen)}
            onLeftIconButtonClick={toggleSideBar}
            showMenuIconButton={!isWelcomeScreen}
            zDepth={isWelcomeScreen ? 0 : 1}
            title={
              <Link to="/" style={styles.titleContainer(isWelcomeScreen)}>
                <img src={logo} alt="logo" style={styles.logo} />
                <span>WatsMyMajor</span>
              </Link>
            }
          >
            <SearchBar
              onResult={this.onSearchResult}
              style={styles.searchBar}
              expandSearch={this.expandSearch}
              closeSearch={this.closeSearch}
            />
            {button}
          </Bar>
        </MediaQuery>
        <MediaQuery maxWidth={800}>
          <Bar
            style={styles.container(isWelcomeScreen)}
            titleStyle={mobileStyles.titleContainer(isWelcomeScreen, expanded)}
            onLeftIconButtonClick={toggleSideBar}
            showMenuIconButton={!isWelcomeScreen}
            zDepth={isWelcomeScreen ? 0 : 1}
            title={
              !expanded && (
                <a href="/">
                  <img src={logo} alt="logo" style={mobileStyles.logo} />
                </a>
              )
            }
          >
            <SearchBar
              onResult={this.onSearchResult}
              style={mobileStyles.searchBar}
              expandSearch={this.expandSearch}
              closeSearch={this.closeSearch}
              popoverProps={{ style: { width: 'auto' } }}
            />
            <MediaQuery minWidth={530}>{!expanded && button}</MediaQuery>
            <MediaQuery maxWidth={530}>{!expanded && xsButton}</MediaQuery>
          </Bar>
        </MediaQuery>
      </div>
    );
  }
}

export default withRouter(AppBar);

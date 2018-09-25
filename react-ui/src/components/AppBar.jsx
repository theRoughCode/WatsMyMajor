import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';
import { darkGrey } from '../constants/Colours';

const styles = {
  container: {
    backgroundColor: darkGrey,
    textAlign: 'left',
    position: 'fixed',
  },
  buttonStyle: {
    marginTop: 11,
    marginLeft: 20
  },
  buttonLabel: {
    color: 'white'
  },
  searchBar: {
    marginTop: '5px',
    width: '30%',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'inherit',
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
    const button = (isLoggedIn)
      ? (
        <FlatButton
          label="Logout"
          onClick={ this.onLogout }
          labelStyle={ styles.buttonLabel }
          style={ styles.buttonStyle }
        />
      )
      : (
        <FlatButton
          label="Login"
          onClick={ this.onLogin }
          labelStyle={ styles.buttonLabel }
          style={ styles.buttonStyle }
        />
      );
    return (
      <Bar
        style={ styles.container }
        onLeftIconButtonClick={ toggleSideBar }
        title={
          <Link to={ `/` } style={ styles.titleLink }>
            WatsMyMajor
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

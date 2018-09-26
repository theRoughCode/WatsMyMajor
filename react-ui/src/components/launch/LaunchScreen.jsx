import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { green, white } from '../../constants/Colours';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  innerContainer: {
    display: 'flex',
    margin: 'auto',
    width: '90%',
    height: 'fit-content',
  },
  leftContainer: {
    width: '50%',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: {
    fontSize: 30,
    fontWeight: 350,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300,
  },
  buttonContainer: {
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: white,
  },
  rightContainer: {
    width: '50%',
  },
  numUsersContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
  },
  numUsersText: {
    fontSize: 15,
    fontWeight: 300,
  },
};

const fetchNumUsers = async () => {
  const response = await fetch('/server/stats/users/count', {
    headers: {
      "x-secret": process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return;
  const { num } = await response.json();
  return num;
};

export default class LaunchScreen extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    numUsers: 0,
  };

  async componentDidMount() {
    const numUsers = await fetchNumUsers();
    this.setState({ numUsers });
  }

  goToLogin = () => this.props.history.push('/login');

  render() {
    return (
      <div style={ styles.container }>
        <div style={ styles.innerContainer }>
          <div style={ styles.leftContainer }>
            <div style={ styles.infoContainer }>
              <div style={ styles.title }>
                Get the most out of your university career
              </div>
              <span style={ styles.subtitle }>
                WatsMyMajor simplifies planning your courses and majors.
              </span>
              <div style={ styles.buttonContainer }>
                <RaisedButton
                  label="Get Started"
                  backgroundColor={ green  }
                  style={ styles.loginButton }
                  labelStyle={ styles.loginText }
                  onClick={ this.goToLogin }
                  type="submit"
                />
              </div>
            </div>
          </div>
          <div style={ styles.rightContainer }>
          </div>
        </div>
        <div style={ styles.numUsersContainer }>
          { this.state.numUsers > 0 && (
            <span style={ styles.numUsersText }>
              { `${this.state.numUsers} total users` }
            </span>
          ) }
        </div>
      </div>
    );
  }
}

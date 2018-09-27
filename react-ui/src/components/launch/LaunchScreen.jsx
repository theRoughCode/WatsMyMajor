import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarIcon from '../../images/calendar_icon.png'
import MortarBoardIcon from '../../images/mortar_board_icon.png'
import SearchIcon from '../../images/search_icon.png'
import WatchingIcon from '../../images/watching_icon.png'
import { green, white, darkGrey } from '../../constants/Colours';

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
    display: 'flex',
    alignItems: 'center',
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
    display: 'flex',
    width: '50%',
  },
  rightInnerContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 'auto',
  },
  iconRow: {
    display: 'flex',
    margin: '10px auto',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    height: 'fit-content',
    margin: 20,
  },
  iconButton: {
    width: 120,
    height: 120,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 380,
    color: darkGrey,
    marginTop: 3,
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

const LaunchIcon = ({ url, text, icon, alt }) => (
  <div style={ styles.iconContainer }>
    <a href={ url }>
      <img src={ icon } alt={ alt } style={ styles.iconButton } />
    </a>
    <span style={ styles.iconText }>{ text }</span>
  </div>
);

LaunchIcon.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
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
            <div style={ styles.rightInnerContainer }>
              <div style={ styles.iconRow }>
                <LaunchIcon
                  url="../schedule"
                  text="Schedule Courses"
                  icon={ CalendarIcon }
                  alt="Schedule"
                />
                <LaunchIcon
                  url="../majors"
                  text="Track Majors"
                  icon={ MortarBoardIcon }
                  alt="Majors"
                />
              </div>
              <div style={ styles.iconRow }>
                <LaunchIcon
                  url="../courses/browse"
                  text="Browse Courses"
                  icon={ SearchIcon }
                  alt="Browse"
                />
                <LaunchIcon
                  url="../courses/browse"
                  text="Watch Classes"
                  icon={ WatchingIcon }
                  alt="Watch Classes"
                />
              </div>
            </div>
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

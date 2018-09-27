import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTooltip from 'react-tooltip';
import WatermanImage from '../../images/waterman.png';
import CalendarIcon from '../../images/calendar_icon.png';
import MortarBoardIcon from '../../images/mortar_board_icon.png';
import SearchIcon from '../../images/search_icon.png';
import WatchingIcon from '../../images/watching_icon.png';
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
    width: '80%',
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
    margin: 'auto',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300,
    margin: 'auto',
  },
  buttonContainer: {
    margin: 'auto',
    marginTop: 10,
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: white,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '50%',
  },
  rightInnerContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: 'auto',
    width: '80%',
  },
  iconRow: {
    display: 'flex',
    margin: '10px auto',
    marginBottom: 20,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    height: 'fit-content',
    marginRight: 30,
  },
  iconButton: {
    width: 90,
    height: 90,
    margin: 'auto',
  },
  iconText: {
    fontSize: 13,
    fontWeight: 380,
    color: darkGrey,
    marginTop: 3,
  },
  waterman: {
    height: 500,
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
    <ReactTooltip id={ text } effect='solid'>
      <span>{ text }</span>
    </ReactTooltip>
    <a data-tip data-for={ text } href={ url } style={{ display: 'flex' }}>
      <img src={ icon } alt={ alt } style={ styles.iconButton } />
    </a>
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
              <div style={ styles.title }>
                Warriors, get the most out of your university career!
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
              <img src={ WatermanImage } alt="waterman" style={ styles.waterman } />
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

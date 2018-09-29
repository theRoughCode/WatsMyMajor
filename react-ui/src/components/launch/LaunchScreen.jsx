import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
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
    flexDirection: 'column',
    width: '100%',
    minHeight: '100%',
    height: 'fit-content',
    backgroundColor: 'white',
  },
  innerContainer: (isMobile) => ({
    display: 'flex',
    flexWrap: 'wrap-reverse',
    margin: 'auto',
    marginBottom: (isMobile) ? 50 : 'auto',
    width: (isMobile) ? '100%' : '80%',
    height: 'fit-content',
  }),
  leftContainer: (isMobile) => ({
    width: (isMobile) ? 'calc(100% - 26px)' : '49%',
    minWidth: (isMobile) ? 'none' : 'fit-content',
    padding: (isMobile) ? '0px 13px' : 'none',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
  }),
  infoContainer: {
    display: 'flex',
    margin: 'auto',
    width: 460,
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: (isMobile) => ({
    fontSize: (isMobile) ? '5vw' : 30,
    fontWeight: 350,
    margin: 'auto',
    marginBottom: 15,
    textAlign: 'center',
  }),
  subtitle: {
    fontSize: 15,
    fontWeight: 300,
    margin: 'auto',
    textAlign: 'center',
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
  rightContainer: (isMobile) => ({
    width: (isMobile) ? '100%' : '50%',
    minWidth: (isMobile) ? 'none' : 'fit-content',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
  rightInnerContainer: (isMobile) => ({
    display: 'flex',
    margin: (isMobile) ? 'auto' : 'none',
  }),
  iconRow: {
    display: 'flex',
    margin: '10px auto',
    marginBottom: 20,
  },
  iconContainer: {
    flex: 1,
    margin: '0px 15px',
  },
  iconButton: {
    width: 90,
    height: 'auto',
    maxWidth: '100%',
    margin: 'auto',
  },
  iconText: {
    fontSize: 13,
    fontWeight: 380,
    color: darkGrey,
    marginTop: 3,
  },
  waterman: (isMobile) => ({
    height: (isMobile) ? '40vh' : '60vh',
  }),
  numUsersContainer: {
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 20,
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
    <a data-tip data-for={ text } href={ url }>
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
      <MediaQuery minDeviceWidth={ 530 }>
        { matches => (
          <div style={ styles.container }>
            <div style={ styles.innerContainer(!matches) }>
              <div style={ styles.leftContainer(!matches) }>
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
                  <div style={ styles.title(!matches) }>
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
              <div style={ styles.rightContainer(!matches) }>
                <div style={ styles.rightInnerContainer(!matches) }>
                  <img src={ WatermanImage } alt="waterman" style={ styles.waterman(!matches) } />
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
        ) }
      </MediaQuery>
    );
  }
}

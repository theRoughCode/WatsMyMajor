import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTooltip from 'react-tooltip';
import WatermanImage from 'images/waterman.png';
import CalendarIcon from 'images/calendar_icon.png';
import MortarBoardIcon from 'images/mortar_board_icon.png';
import SearchIcon from 'images/search_icon.png';
import WatchingIcon from 'images/watching_icon.png';
import { green, white, darkGrey } from 'constants/Colours';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: 'calc(100% - 0.5vh)',
    backgroundColor: 'white',
    paddingBottom: '0.5vh',
  },
  innerContainer: (isMobile) => ({
    display: 'flex',
    flexWrap: 'wrap-reverse',
    margin: 'auto',
    flex: (isMobile) ? 1 : 'none',
    width: (isMobile) ? '100%' : '80%',
    height: 'fit-content',
  }),
  leftContainer: (isMobile) => ({
    width: (isMobile) ? 'calc(100% - 26px)' : '50%',
    padding: (isMobile) ? '0px 13px' : 'none',
    margin: 'auto',
    marginTop: (isMobile) ? 0 : 'auto',
    display: 'flex',
    alignItems: 'center',
  }),
  infoContainer: {
    display: 'flex',
    margin: 'auto',
    maxWidth: 460,
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
  subtitle: (isMobile) => ({
    fontSize: (isMobile) ? '3.5vw' : 15,
    fontWeight: 300,
    margin: 'auto',
    textAlign: 'center',
  }),
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
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
  rightInnerContainer: (isMobile) => ({
    margin: (isMobile) ? 'auto' : 'none',
    maxWidth: '100%',
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
    height: 'auto',
    width: '100%',
    margin: 'auto',
  },
  iconText: {
    fontSize: 13,
    fontWeight: 380,
    color: darkGrey,
    marginTop: 3,
  },
  waterman: (isMobile) => ({
    height: (isMobile) ? '40vh' : 'auto',
    width: (isMobile) ? 'auto' : '30vw',
    maxWidth: '100%',
  }),
  footer: {
    display: 'flex',
    margin: 20,
    marginBottom: 0,
  },
  fbContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  numUsersContainer: {
    display: 'flex',
    textAlign: 'right',
  },
  numUsersText: (isMobile) => ({
    fontSize: (isMobile) ? '1.5vh' : 15,
    fontWeight: 300,
    margin: 'auto',
    marginBottom: 0,
  }),
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
    <ReactTooltip id={ text } effect='solid' place='top'>
      <span>{ text }</span>
    </ReactTooltip>
    <div data-tip data-for={ text }>
      <a href={ url }>
        <img src={ icon } alt={ alt } style={ styles.iconButton } />
      </a>
    </div>
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

    // Init fb like button
    if (window.FB) window.FB.XFBML.parse();
  }

  goToLogin = () => this.props.history.push('/login');

  render() {
    return (
      <MediaQuery minWidth={ 530 }>
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
                  <span style={ styles.subtitle(!matches) }>
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
            <div style={ styles.footer }>
              <div
                className="fb-like"
                id="fb-like-home"
                style={ styles.fbContainer }
                data-href="https://www.watsmymajor.com/"
                data-layout="standard"
                data-action="like"
                data-share="true"
                data-show-faces="true"
              />
              <div style={ styles.numUsersContainer }>
                { this.state.numUsers > 0 && (
                  <span style={ styles.numUsersText(!matches) }>
                    { `${this.state.numUsers} total users` }
                  </span>
                ) }
              </div>
            </div>
          </div>
        ) }
      </MediaQuery>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Snackbar from 'material-ui/Snackbar';
import AppBar from 'components/AppBar';
import SideBar from 'components/sidebar/SideBarContainer';
import PrivacyPolicy from 'components/privacy/PrivacyPolicy';
import Dashboard from 'components/dashboard/Dashboard';
import LaunchScreen from 'components/launch/LaunchScreen';

// TODO: rename 'login' to 'account', leaving it for now to preserve git diff
import { Login, Register, ResetPassword, ForgotPassword } from 'components/login';

import VerifyEmail from 'components/email/VerifyEmail';
import UnwatchedClass from 'components/email/UnwatchedClass';
import Settings from 'components/settings/SettingsContainer';
import Majors from 'components/majors/MajorsContainer';
import BrowseCourseView from 'components/browse/BrowseCourseContainer';
import MyCourseView from 'components/mycourse/CourseBoardContainer';
import MyScheduleView from 'components/schedule/MyScheduleContainer';
import CourseView from 'components/courselist/CourseViewContainer';
import LoadingView from 'components/tools/LoadingView';
import {
  toggleSideBar,
  createSnack,
  loginUser,
  logoutUser,
} from './actions';
import './stylesheets/App.css';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
  marginLeft: 0,
  transition: 'all 1s ease-in-out',
  height: 'calc(100% - 64px)',
  boxSizing: 'border-box'
};

class App extends Component {

  static propTypes = {
    sideBarOpen: PropTypes.bool.isRequired,
    snack: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    onToggleSideBar: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onUndoSnack: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {
      sideBarOpen,
      snack,
      isLoggedIn,
      username,
      onToggleSideBar,
      onLogin,
      onLogout,
      onUndoSnack,
    } = props;

    this.state = {
      username,
      subject: '',
      catalogNumber: '',
      message: null,
      fetching: true,
      hasSnack: false,
      sideBarOpen,
      snackAutoHideDuration: 2000,
      snackOpen: false,
      snack,
      isLoggedIn,
      loading: true,
    };

    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.addRedirect = this.addRedirect.bind(this);
    this.onToggleSideBar = onToggleSideBar;
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this.onUndoSnack = onUndoSnack;
  }

  componentDidMount() {
    // Check localStorage if username is not set
    const cachedUsername = localStorage.getItem('wat-username');
    if (cachedUsername) {
      this.setState({ isLoggedIn: true });
      this.onLogin(cachedUsername);
    } else this.setState({ loading: false });

    // Listen for route change
    this.props.history.listen(this.handleRouteChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sideBarOpen !== this.state.sideBarOpen) {
      this.setState({ sideBarOpen: nextProps.sideBarOpen });
    }

    if (nextProps.snack !== this.state.snack) {
      this.setState({
        snackOpen: true,
        snack: nextProps.snack
      });
    }

    if (nextProps.isLoggedIn !== this.state.isLoggedIn) {
      this.setState({ isLoggedIn: nextProps.isLoggedIn });
      if (this.state.loading) this.setState({ loading: false });
    }

    if (nextProps.username !== this.state.username) {
      this.setState({ loading: false, username: nextProps.username });
    }
  }

  handleRouteChange({ pathname }) {
    const pathArr = pathname.split("/").slice(1);
    switch (pathArr[0]) {
    case "majors": // View majors
      document.title = "View Majors - WatsMyMajor";
      break;
    case "my-courses": // My courses
      document.title = "My Courses - WatsMyMajor";
      break;
    case "schedule": // My schedule
      document.title = "My Schedule - WatsMyMajor";
      break;
    case "welcome":
      this.setState({ sideBarOpen: false });
      // falls through
    default:
      document.title = "WatsMyMajor - University of Waterloo Course Planner";
    }
  }

  handleRequestClose() {
    this.setState({ snackOpen: false });
  }

  handleActionClick() {
    const { handleActionClick, undoMsg } = this.state.snack;
    this.setState({ snackOpen: false });
    handleActionClick();
    if (undoMsg) this.props.onUndoSnack(undoMsg);
  }

  // Redirects to Login if not logged in
  addRedirect(Component, redirectUrl = '/login') {
    return (props) => (
      (this.state.isLoggedIn) ? <Component { ...props } /> : <Redirect to={ redirectUrl } />
    );
  }

  // Redirects to dashboard if logged in
  addUndirect(Component) {
    return (props) => (
      (this.state.isLoggedIn) ? <Redirect to="/" /> : <Component { ...props } />
    );
  }

  render() {
    const newStyles = (isXSmall) => Object.assign({}, styles, {
      marginLeft: (!isXSmall && this.state.sideBarOpen) ? 200 : 0,
      transition: (!isXSmall && this.state.sideBarOpen)
        ? 'all 0.3s ease-in-out'
        : 'all 0.225s ease-out'
    });

    if (this.state.loading) {
      return <LoadingView />;
    }

    return (
      <MediaQuery minWidth={ 475 }>
        { matches => (
          <div className="App">
            <AppBar
              toggleSideBar={ this.onToggleSideBar }
              onLogout={ this.onLogout }
              isLoggedIn={ this.state.isLoggedIn }
            />
            <SideBar open={ this.state.sideBarOpen } />
            <div style={ newStyles(!matches) }>
              <Switch>
                <Route exact path='/' render={ this.addRedirect(Dashboard, '/welcome') } />
                <Route path='/privacy-policy' component={ PrivacyPolicy } />
                <Route path='/welcome' render={ this.addUndirect(LaunchScreen) } />
                <Route path='/register' render={ this.addUndirect(Register) } />
                <Route path='/login' render={ this.addUndirect(Login) } />
                <Route path='/forgot-password' render={ this.addUndirect(ForgotPassword) } />
                <Route path='/reset-password' render={ this.addUndirect(ResetPassword) } />
                <Route path='/verify-email' component={ VerifyEmail } />
                <Route path='/unwatch-class' component={ UnwatchedClass } />
                <Route path='/settings' render={ this.addRedirect(Settings) } />
                <Route path='/majors/:faculty?/:majorKey?' component={ Majors } />
                <Route path='/my-courses' render={ this.addRedirect(MyCourseView) } />
                <Route path='/my-schedule/:term?' render={ this.addRedirect(MyScheduleView) } />
                <Route path='/schedule/:username/:term?' component={ MyScheduleView } />
                <Route path='/courses/browse' component={ BrowseCourseView } />
                <Route path='/courses/:subject/:catalogNumber' component={ CourseView } />
              </Switch>
            </div>
            <ToastContainer />
            <Snackbar
              open={ this.state.snackOpen }
              message={ this.state.snack.msg }
              action={ this.state.snack.actionMsg }
              autoHideDuration={ this.state.snackAutoHideDuration }
              onActionClick={ this.handleActionClick }
              onRequestClose={ this.handleRequestClose }
            />
          </div>
        ) }
      </MediaQuery>
    );
  }
}

const mapStateToProps = ({ sideBarOpen, snack, isLoggedIn, user }) => {
  return { sideBarOpen, snack, isLoggedIn, username: user.username };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => dispatch(toggleSideBar()),
    onUndoSnack: (msg) =>  dispatch(createSnack(msg)),
    onLogin: (username) => dispatch(loginUser(username)),
    onLogout: () => dispatch(logoutUser()),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

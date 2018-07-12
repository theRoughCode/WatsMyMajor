import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
	withRouter
} from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import { toggleSideBar, createSnack, loginUser, logoutUser } from './actions';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/sidebar/SideBarContainer';
import Dashboard from './components/Dashboard';
import Login from './components/login/Login';
import Register from './components/login/Register';
import PrereqsTree from './components/tree/PrerequisitesTreeContainer';
import MyCourseView from './components/mycourse/CourseBoardContainer';
import MyScheduleView from './components/schedule/MySchedule';
import BrowseCourse from './components/courselist/BrowseCourse';
import CourseListView from './components/courselist/CourseListContainer';

let styles = {
	marginLeft: 0,
	transition: 'all 1s ease-in-out',
  height: '100%',
  paddingTop: 64,
  boxSizing: 'border-box'
};

class App extends Component {

	static propTypes = {
    sideBarOpen: PropTypes.bool.isRequired,
    snack: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
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
      onToggleSideBar,
      onLogin,
			onLogout,
			onUndoSnack
		} = props;

    // Check localStorage if username is not set
    const cachedUsername = localStorage.getItem('wat-username');
    if (cachedUsername) onLogin(cachedUsername);

    this.state = {
			subject: '',
			catalogNumber: '',
      message: null,
      fetching: true,
			hasSnack: false,
			sideBarOpen,
			snackAutoHideDuration: 2000,
			snackOpen: false,
			snack,
      isLoggedIn: isLoggedIn || (cachedUsername != null),
    };

		this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
		this.addRedirect = this.addRedirect.bind(this);
    this.onToggleSideBar = onToggleSideBar;
    this.onLogin = onLogin;
		this.onLogout = onLogout;
		this.onUndoSnack = onUndoSnack;
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
      this.setState({ isLoggedIn: nextProps.isLoggedIn});
    }
	}

	handleRequestClose() {
		this.setState({ snackOpen: false });
	}

	handleActionClick() {
		this.setState({ snackOpen: false });
		this.state.snack.handleActionClick();
		this.props.onUndoSnack(this.state.snack.undoMsg);
	}

  // Redirects to Login if not logged in
  addRedirect(Component) {
    return (props) => (
      (this.state.isLoggedIn) ? <Component {...props} /> : <Redirect to="/login" />
    );
  }

  // Redirects to dashboard if logged in
  addUndirect(Component) {
    return (props) => (
      (this.state.isLoggedIn) ? <Redirect to="/" /> : <Component {...props} />
    );
  }

  render() {
    const marginLeft = (this.state.sideBarOpen) ? '256px' : 0;
		const transition = (this.state.sideBarOpen)
													? 'all 0.3s ease-in-out'
													: 'all 0.225s ease-out';
		styles = Object.assign({}, styles, { marginLeft, transition });

    return (
			<div className="App">
				<AppBar
          toggleSideBar={this.onToggleSideBar}
          onLogout={this.onLogout}
          isLoggedIn={this.state.isLoggedIn}
        />
				<SideBar open={this.state.sideBarOpen} />
        <div style={styles}>
  				<Switch>
            <Route exact path='/' render={ this.addRedirect(Dashboard) } />
            <Route exact path='/register' render={ this.addUndirect(Register) } />
  					<Route exact path='/login' render={ this.addUndirect(Login) } />
            <Route path='/my-courses' render={ this.addRedirect(MyCourseView) } />
            <Route path='/schedule' render={ this.addRedirect(MyScheduleView) } />
  					<Route exact path='/courses' render={ this.addRedirect(BrowseCourse) } />
            <Route path='/courses/:subject/:catalogNumber' render={ this.addRedirect(CourseListView) } />
  					<Route path='/tree/prereqs/:subject/:catalogNumber' render={ this.addRedirect(PrereqsTree) } />
  				</Switch>
  			</div>
				<Snackbar
					open={this.state.snackOpen}
					message={this.state.snack.msg}
					action={this.state.snack.actionMsg}
					autoHideDuration={this.state.snackAutoHideDuration}
					onActionClick={this.handleActionClick}
					onRequestClose={this.handleRequestClose}
				/>
			</div>
    );
  }
}

const mapStateToProps = ({ sideBarOpen, snack, isLoggedIn }) => {
	return { sideBarOpen, snack, isLoggedIn };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		onUndoSnack: (msg) => {
			dispatch(createSnack(msg));
		},
    onLogin: (username) => {
      dispatch(loginUser(username));
    },
    onLogout: () => {
      dispatch(logoutUser());
    },
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

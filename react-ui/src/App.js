import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
	withRouter
} from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import { toggleSideBar, createSnack } from './actions/index';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/sidebar/SideBarContainer';
import Dashboard from './components/Dashboard';
import Login from './components/login/Login';
import Register from './components/login/Register';
import PrereqsTree from './components/tree/PrerequisitesTreeContainer';
import MyCourseView from './components/mycourse/MyCourseContainer';
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
		onToggleSideBar: PropTypes.func.isRequired,
		onUndoSnack: PropTypes.func.isRequired
	};

  constructor(props) {
    super(props);

		const {
			view,
			sideBarOpen,
			snack,
      username,
			onToggleSideBar,
			onUndoSnack
		} = props;

    this.state = {
      username,
			subject: '',
			catalogNumber: '',
      message: null,
      fetching: true,
			hasSnack: false,
			view,
			sideBarOpen,
			snackAutoHideDuration: 2000,
			snackOpen: false,
			snack
    };

		this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
		this.addRedirect = this.addRedirect.bind(this);
		this.onToggleSideBar = onToggleSideBar;
		this.onUndoSnack = onUndoSnack;
	}

	componentWillReceiveProps(nextProps) {
	  if (nextProps.view !== this.state.view ||
				nextProps.sideBarOpen !== this.state.sideBarOpen) {
			this.setState(nextProps);
		}

		if (nextProps.snack !== this.state.snack) {
			this.setState({
				snackOpen: true,
				snack: nextProps.snack
			});
		}

    if (nextProps.username !== this.state.username) {
      this.setState({ username: nextProps.username });
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
      (this.state.username) ? <Component {...props} /> : <Redirect to="/login" />
    );
  }

  render() {
    const marginLeft = (this.state.sideBarOpen) ? '256px' : 0;
		const transition = (this.state.sideBarOpen)
													? 'all 0.3s ease-in-out'
													: 'all 0.225s ease-out';
		styles = Object.assign({}, styles, { marginLeft, transition });

    return (
			<Router>
				<div className="App">
					<AppBar toggleSideBar={this.onToggleSideBar} />
					<SideBar open={this.state.sideBarOpen} />
          <div style={styles}>
    				<Switch>
              <Route exact path='/' render={ this.addRedirect(Dashboard) } />
              <Route exact path='/register' component={ Register } />
    					<Route exact path='/login' component={ Login } />
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
			</Router>
    );
  }

}

const mapStateToProps = ({ view, sideBarOpen, snack, user }) => {
	return { view, sideBarOpen, snack, username: user.name };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		onUndoSnack: (msg) => {
			dispatch(createSnack(msg));
		}
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
	withRouter
} from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import './stylesheets/App.css';
import { setUser, toggleSideBar, setCourse, createSnack } from './actions/index';
import { objectEquals } from './utils/arrays';
import AppBar from './components/AppBar';
import SideBar from './components/sidebar/SideBar';
import Dashboard from './components/Dashboard';
import MyCourseView from './components/mycourse/MyCourseContainer';
import MyScheduleView from './components/schedule/MySchedule';
import CourseListBrowseView from './components/CourseListBrowseContainer';
import CourseListView from './components/courselist/CourseListContainer';

const drawerWidth = 270;
const snackAutoHideDuration = 2000;
const styles = theme => ({
  // SideBar
  drawer: {
    position: 'fixed',
    width: drawerWidth
  },
	avatar: {
    height: 'auto',
    display: 'flex',
		padding: '20px',
		backgroundColor: 'rgb(54, 65, 80)'
	},
  avatarButton: {
    '&:hover': {
      backgroundColor: 'rgb(69, 83, 102)',
    }
  },
  link: {
    textDecoration: 'none',
		color: 'inherit'
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  // AppBar
  appBar: {
    position: 'fixed',
    backgroundColor: 'rgb(43, 54, 67)',
  	textAlign: 'left',
  	color: '#E0F7FA',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  button: {
    margin: '0px 10px',
    "&:hover": {
      backgroundColor: 'rgb(69, 83, 102)',
    }
  },
  // Main Content
  content: {
    flexGrow: 1,
    height: '100%',
    paddingTop: 64,
    boxSizing: 'border-box',
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

class App extends Component {

	static propTypes = {
    sideBarOpen: PropTypes.bool.isRequired,
    snack: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
		onToggleSideBar: PropTypes.func.isRequired,
		onUndoSnack: PropTypes.func.isRequired,
	};

  constructor(props) {
    super(props);
    // TODO: Remove once login functionality has been implemented
    props.onSetUser('theroughcode');

		const {
			sideBarOpen,
			snack,
      username,
			onToggleSideBar,
			onUndoSnack
		} = props;

    this.state = {
			sideBarOpen,
			snackOpen: false,
			snack,
      username
    };

		this.handleRequestClose = this.handleRequestClose.bind(this);
		this.handleActionClick = this.handleActionClick.bind(this);
		this.onToggleSideBar = onToggleSideBar;
		this.onUndoSnack = onUndoSnack;
	}

  componentWillReceiveProps(nextProps) {
    if (nextProps.sideBarOpen !==  this.state.sideBarOpen) {
      this.setState({ sideBarOpen: nextProps.sideBarOpen });
    }
    if (nextProps.username !== this.state.username) {
      this.setState({ username: nextProps.username });
    }
    if (!objectEquals(nextProps.snack, this.state.snack)) {
      this.setState({ snack: nextProps.snack });
    }
  }

	handleRequestClose() {
		this.setState({ snackOpen: false });
	}

	handleActionClick() {
		this.setState({ snackOpen: false });
		this.state.snack.handleActionClick();
		this.onUndoSnack(this.state.snack.undoMsg);
	}

  render() {
    const {
      sideBarOpen,
      username,
      snackOpen,
      snack,
    } = this.state;
    const { classes } = this.props;

    return (
			<Router>
				<div className="App">
					<AppBar
            sideBarOpen={sideBarOpen}
            toggleSideBar={this.onToggleSideBar}
            classes={classes}
          />
          <SideBar
            sideBarOpen={sideBarOpen}
            username={username}
            classes={classes}
          />
          <div
            className={classNames(
              classes.content,
              { [classes.contentShift]: sideBarOpen }
            )}
          >
    				<Switch>
    					<Route exact path='/' component={ Dashboard } />
              <Route path='/my-courses' component={ MyCourseView } />
              <Route path='/schedule' component={ MyScheduleView } />
    					<Route exact path='/courses' component={ CourseListBrowseView } />
    					<Route path='/courses/:subject/:catalogNumber' component={ CourseListView } />
    				</Switch>
    			</div>
  				<Snackbar
  					open={snackOpen}
  					message={snack.msg}
  					action={snack.actionMsg}
  					autoHideDuration={snackAutoHideDuration}
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
    onSetUser: (username) => {
      dispatch(setUser(username));
    },
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		onUndoSnack: (msg) => {
			dispatch(createSnack(msg));
		}
  }
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)
  (withStyles(styles, { withTheme: true })(App))
);

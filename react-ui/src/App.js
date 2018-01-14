import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { toggleSideBar, setCourse, createSnack } from './actions/index';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import MyCourseView from './components/MyCourseContainer';
import CourseListView from './components/CourseListContainer';
import {
	DASHBOARD_VIEW,
	MY_COURSE_VIEW,
	COURSE_LIST_VIEW
} from './constants/views';

let styles = {
	marginLeft: 0,
	transition: 'all 1s ease-in-out'
}

class App extends Component {

	static propTypes = {
		onToggleSideBar: PropTypes.func.isRequired,
		onSearch: PropTypes.func.isRequired,
		onUndoSnack: PropTypes.func.isRequired
	};

  constructor(props) {
    super(props);

		const {
			view,
			sideBarOpen,
			snack,
			onToggleSideBar,
			onSearch,
			onUndoSnack
		} = props;

    this.state = {
      message: null,
      fetching: true,
			hasSnack: false,
			view,
			sideBarOpen,
			snackAutoHideDuration: 2000,
			snackOpen: false,
			snack
    };

		this.getView = this.getView.bind(this);
		this.handleRequestClose = this.handleRequestClose.bind(this);
		this.handleActionClick = this.handleActionClick.bind(this);
		this.onToggleSideBar = onToggleSideBar;
		this.onSearch = onSearch;
		this.onUndoSnack = onUndoSnack;
	}

	getView() {
		let view = null;
		const marginLeft = (this.state.sideBarOpen) ? '256px' : 0;
		const transition = (this.state.sideBarOpen)
													? 'all 0.3s ease-in-out'
													: 'all 0.225s ease-out';
		styles = Object.assign({}, styles, { marginLeft, transition });

		switch (this.state.view) {
			case DASHBOARD_VIEW:
				view = <Dashboard />;
				break;
			case MY_COURSE_VIEW:
				view = <MyCourseView />;
				break;
			case COURSE_LIST_VIEW:
				view = <CourseListView />
				break;
			default:
				view = null;
		}

		return (
			<div style={styles}>
				{view}
			</div>
		);
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
	}

	handleRequestClose() {
		this.setState({ snackOpen: false });
	}
	handleActionClick() {
		this.setState({ snackOpen: false });
		this.state.snack.handleActionClick();
		this.props.onUndoSnack(this.state.snack.undoMsg);
	}

  render() {
    return (
      <div className="App">
        <AppBar
					toggleSideBar={this.onToggleSideBar}
					onSearch={this.onSearch}
					/>
				<SideBar open={this.state.sideBarOpen} />
				{this.getView()}
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

const mapStateToProps = ({ view, sideBarOpen, snack }) => {
	return { view, sideBarOpen, snack };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		onSearch: (course) => {
			if (!course) return;
			dispatch(setCourse(course));
		},
		onUndoSnack: (msg) => {
			dispatch(createSnack(msg));
		}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

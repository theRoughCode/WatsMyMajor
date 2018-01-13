import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSideBar, setCourse } from './actions/index';
import './stylesheets/App.css';
import AppBar from './components/AppBar';
import SideBar from './components/SideBar';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseViewContainer';
import { DASHBOARD_VIEW, COURSE_VIEW } from './constants/views';

let styles = {
	marginLeft: 0,
	transition: 'all 1s ease-in-out'
}

class App extends Component {

	static propTypes = {
		onToggleSideBar: PropTypes.func.isRequired
	};

  constructor(props) {
    super(props);

    this.state = {
      message: null,
      fetching: true
    };

		this.getView = this.getView.bind(this);
	}

	getView() {
		let view = null;
		const marginLeft = (this.props.sideBarOpen) ? '256px' : 0;
		const transition = (this.props.sideBarOpen)
													? 'all 0.3s ease-in-out'
													: 'all 0.225s ease-out';
		styles = Object.assign({}, styles, { marginLeft, transition });

		switch (this.props.view) {
			case DASHBOARD_VIEW:
				view = <Dashboard />;
				break;
			case COURSE_VIEW:
				view = <CourseView />
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

  render() {
    return (
      <div className="App">
        <AppBar
					toggleSideBar={this.props.onToggleSideBar}
					onSearch={this.props.onSearch}
					/>
				<SideBar open={this.props.sideBarOpen} />
				{this.getView()}
      </div>
    );
  }

}

const mapStateToProps = ({ view, sideBarOpen }) => {
	return { view, sideBarOpen };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
		onSearch: (course) => {
			if (!course) return;
			dispatch(setCourse(course));
		}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

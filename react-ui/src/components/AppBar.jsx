import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';
import { removeExpandedCourse } from '../actions';


const styles = {
	container: {
		backgroundColor: 'rgb(43, 54, 67)',
		textAlign: 'left',
		color: '#E0F7FA',
		position: 'fixed',
	},
	logoutButton: {
		marginTop: 11,
		marginRight: 20
	},
	logoutLabel: {
		color: 'white'
	}
};

class AppBar extends Component {
	static propTypes = {
		toggleSideBar: PropTypes.func.isRequired,
		onLogout: PropTypes.func.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
		removeExpandedCourseHandler: PropTypes.func.isRequired,
	};

	onSearchResult = (subject, catalogNumber) => {
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
		this.props.removeExpandedCourseHandler();
	}

	render() {
		const { toggleSideBar, onLogout, isLoggedIn } = this.props;
		return (
			<Bar
				style={ styles.container }
				onLeftIconButtonClick={ toggleSideBar }
				title="WatsMyMajor"
			>
				{ isLoggedIn && (
					<FlatButton
						label="Logout"
						onClick={ onLogout }
						labelStyle={ styles.logoutLabel }
						style={ styles.logoutButton }
					/>
				) }
				<SearchBar onResult={ this.onSearchResult } />
			</Bar>
		);
	}
}

const mapDispatchToProps = dispatch => ({
  removeExpandedCourseHandler: () => dispatch(removeExpandedCourse())
});

export default withRouter(connect(null, mapDispatchToProps)(AppBar))

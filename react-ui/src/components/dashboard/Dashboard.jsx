import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import BrowseCourse from '../browse/BrowseCourseContainer';
import PopularCourseGraph from './PopularCourseGraph';
import UserCoursesGraph from './UserCoursesGraph';
import { white } from '../../constants/Colours';

const styles = {
	header: {
		backgroundColor: white,
		paddingLeft: 20,
		color: 'black',
		display: 'flex',
	},
	headerText: {
		fontSize: 25,
		fontWeight: 500,
	},
	graphContainer: {
		display: 'flex',
		margin: 20,
		marginTop: 40,
	},
};

const Dashboard = ({ name, myCourses }) => (
	<div>
		<Paper style={ styles.header }>
			<h2 style={ styles.headerText }>Welcome to WatsMyMajor, { name }!</h2>
		</Paper>
		<div style={ styles.graphContainer }>
			<PopularCourseGraph />
			<UserCoursesGraph myCourses={ myCourses } />
		</div>
		<BrowseCourse />
	</div>
);

Dashboard.propTypes = {
	name: PropTypes.string.isRequired,
	myCourses: PropTypes.object.isRequired,
};

const mapStateToProps = ({ user, myCourses }) => ({
	name: user.name,
	myCourses,
});

export default connect(mapStateToProps, null)(Dashboard);

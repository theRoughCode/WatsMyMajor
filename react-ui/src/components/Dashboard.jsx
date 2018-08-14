import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import BrowseCourse from './browse/BrowseCourseContainer';
import { white } from '../constants/Colours';

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
	introText: {
		fontSize: 'large',
		lineHeight: 2,
	}
};

const Dashboard = ({ name }) => (
	<div>
		<Paper style={ styles.header }>
			<h2 style={ styles.headerText }>Welcome to WatsMyMajor, { name }!</h2>
		</Paper>
		<p style={ styles.introText }>
			{"Congrats, you are one of our beta access users!"}<br />
			{"If you find a bug, you can let me know or submit an issue "}
			<a href="https://github.com/theRoughCode/watsmymajorbeta/issues">
				here
			</a>!<br/>
		</p>
		<BrowseCourse />
	</div>
);

Dashboard.propTypes = {
	name: PropTypes.string.isRequired,
};

const mapStateToProps = ({ user }) => ({ name: user.name });

export default connect(mapStateToProps, null)(Dashboard);

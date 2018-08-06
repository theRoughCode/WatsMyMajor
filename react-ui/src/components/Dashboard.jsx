import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BrowseCourse from './browse/BrowseCourseContainer';

const styles = {
	header: {
		backgroundColor: '#cce1ff',
		height: 150,
		padding: 20,
		color: 'black',
	},
	logo: {
		animation: 'App-logo-spin infinite 20s linear',
		width: 80,
		height: 80,
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
		<div style={ styles.header }>
			<img src="images/logo.png" style={ styles.logo } alt="logo" />
			<h2 style={ styles.headerText }>Welcome to WatsMyMajor, { name }!</h2>
		</div>
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

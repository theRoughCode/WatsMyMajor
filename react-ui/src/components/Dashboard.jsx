import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BrowseCourse from './browse/BrowseCourseContainer';

const Dashboard = ({ name }) => (
	<div>
		<div className="App-header">
			<img src="images/logo.png" className="App-logo" alt="logo" />
			<h2>Welcome to WatsMyMajor, { name }!</h2>
		</div>
		<p className="App-intro">
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

import React from 'react';
import logo from '../logo.svg';

const styles = {
	header: {
		backgroundColor: '#656e77',
		height: 150,
		padding: 20,
		color: 'white'
	},
	logo: {
		animation: 'App-logo-spin infinite 20s linear',
		height: 80
	},
	intro: {
		fontSize: 'large'
	}
};

const Dashboard = () => (
	<div>
		<div style={styles.header}>
			<img src={logo} style={styles.logo} alt="logo" />
			<h2>Welcome to React</h2>
		</div>
		<p style={styles.intro}>
			{'This is '}
			<a href="https://github.com/mars/heroku-cra-node">
				{'create-react-app with a custom Node/Express server'}
			</a><br/>
		</p>
	</div>
);

export default Dashboard;

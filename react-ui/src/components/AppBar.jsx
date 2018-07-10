import React from 'react';
import PropTypes from 'prop-types';
import Bar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import SearchBar from './SearchBar';


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

const AppBar = ({ toggleSideBar, onLogout, isLoggedIn }) => (
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
		<SearchBar />
	</Bar>
);

AppBar.propTypes = {
	toggleSideBar: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
}


export default AppBar;

import React from 'react';
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

const AppBar = ({ toggleSideBar, onLogout }) => (
	<Bar
		style={ styles.container }
		onLeftIconButtonClick={ toggleSideBar }
		title="WatsMyMajor"
	>
		<FlatButton
			label="Logout"
			onClick={ onLogout }
			labelStyle={ styles.logoutLabel }
			style={ styles.logoutButton }
		/>
		<SearchBar />
	</Bar>
);


export default AppBar;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import SearchBar from './SearchBar';


const styles = {
	backgroundColor: 'rgb(43, 54, 67)',
	textAlign: 'left',
	color: '#E0F7FA',
	position: 'fixed'
};

const AppAppBar = ({ toggleSideBar }) => (
	<AppBar
		style={styles}
		onLeftIconButtonClick={ toggleSideBar }
		title="Wat'sMyMajor"
	>
		<SearchBar />
	</AppBar>
);


export default AppAppBar;

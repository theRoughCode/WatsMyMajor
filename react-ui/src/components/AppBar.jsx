import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Bar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchBar from './SearchBar';

const AppBar = ({ toggleSideBar, sideBarOpen, classes }) => (
	<Bar
		className={
			classNames(classes.appBar, {
				[classes.appBarShift]: sideBarOpen
			})
		}
	>
		<Toolbar disableGutters>
			<IconButton onClick={ toggleSideBar } color="inherit" className={classes.button}>
        <MenuIcon />
      </IconButton>
      <Typography variant="title" color="inherit" style={{ 'flex': 1 }} noWrap>
        Wat'sMyMajor
      </Typography>
			<SearchBar />
			<Button color="inherit" className={classes.button}>Login</Button>
		</Toolbar>
	</Bar>
);

AppBar.propTypes = {
	toggleSideBar: PropTypes.func.isRequired,
	sideBarOpen: PropTypes.bool.isRequired,
	classes: PropTypes.object.isRequired
}

export default AppBar;

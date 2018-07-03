import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	avatarWrapper: {
		display: 'flex',
	  flexDirection: 'column',
		margin: 'auto',
		width: 'auto'
	},
	avatarIcon: {
		margin: 'auto',
		width: 100,
		height: 100
	},
	avatarName: {
		color: 'white',
	  margin: 'auto'
	}
};

const SideBarAvatar = ({ name, classes }) => (
	<div style={styles.avatarWrapper}>
		<Avatar
			className={classes.avatarIcon}
			src='images/avatar.jpg'
		/>
		<span className={classes.avatarName}>{ name }</span>
	</div>
);

SideBarAvatar.propTypes = {
	name: PropTypes.string
};

SideBarAvatar.defaultProps = {
	name: ''
};

export default withStyles(styles)(SideBarAvatar);

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';


const SideBarAvatar = ({ name }) => (
	<div className="avatar-wrapper">
		<Avatar
			className="avatar-icon"
			src='images/avatar.jpg'
			size={100}
		/>
		<span className="avatar-name">{ name }</span>
	</div>
);

SideBarAvatar.propTypes = {
	name: PropTypes.string
};

SideBarAvatar.defaultProps = {
	name: ''
};

export default SideBarAvatar;

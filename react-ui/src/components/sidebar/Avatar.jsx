import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';


const SideBarAvatar = ({ name, profileURL }) => (
	<div className="avatar-wrapper">
		<Avatar
			className="avatar-icon"
			src={ profileURL }
			size={100}
			style={{ objectFit: 'cover' }}
		/>
		<span className="avatar-name">{ name }</span>
	</div>
);

SideBarAvatar.propTypes = {
	name: PropTypes.string.isRequired,
	profileURL: PropTypes.string.isRequired,
};

export default SideBarAvatar;

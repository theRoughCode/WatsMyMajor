import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import PersonIcon from 'material-ui/svg-icons/social/person';
import UnitsIcon from 'material-ui/svg-icons/communication/import-contacts';
import EnrolledIcon from 'material-ui/svg-icons/action/account-circle';
import WaitingIcon from 'material-ui/svg-icons/social/people';
import BlockIcon from 'material-ui/svg-icons/content/block';

const styles = {
	icon: {
		width: '20px',
		height: '20px',
		marginRight: '10px'
	},
	info: {
		display: 'flex',
		marginTop: 10,
	},
	container: {
		textAlign: 'left',
		fontSize: 15,
		padding: '10px 20px',
		paddingBottom: 0,
	},
};

const Info = ({ icon, info }) => (
	<div style={ styles.info }>
		{icon}
		{info}
	</div>
);

const ClassInfo = ({
	units,
	attending,
	enrollmentCap,
	waiting,
	waitingCap,
	reserved,
	reserveCap,
	reserveGroup,
}) => (
	<div style={ styles.container }>
		<Info
			icon={ <UnitsIcon style={ styles.icon } /> }
			info={ `Units: ${units}` }
		/>
		<Info
			icon={ <EnrolledIcon style={ styles.icon } /> }
			info={ `Attending: ${attending}` }
		/>
		<Info
			icon={ <div style={ styles.icon }></div> }
			info={ `Enrollment cap: ${enrollmentCap}` }
		/>
		<Info
			icon={ <WaitingIcon style={ styles.icon } /> }
			info={ `Waiting: ${waiting}` }
		/>
		<Info
			icon={ <div style={ styles.icon }></div> }
			info={ `Waiting cap: ${waitingCap}` }
		/>
		<Info
			icon={ <BlockIcon style={ styles.icon } /> }
			info={ `Reserved: ${reserved}` }
		/>
		<Info
			icon={ <div style={ styles.icon }></div> }
			info={ `Reserved cap: ${reserveCap}` }
		/>
		<Info
			icon={ <div style={ styles.icon }></div> }
			info={ `Reserve group: ${reserveGroup}` }
		/>
	</div>
);

ClassInfo.propTypes = {
	units: PropTypes.number.isRequired,
	attending: PropTypes.number.isRequired,
  enrollmentCap: PropTypes.number.isRequired,
	waiting: PropTypes.number.isRequired,
  waitingCap: PropTypes.number.isRequired,
	reserved: PropTypes.number.isRequired,
	reserveCap: PropTypes.number.isRequired,
	reserveGroup: PropTypes.string.isRequired,
};

export default ClassInfo;

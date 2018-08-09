import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui/svg-icons/social/person';
import UnitsIcon from 'material-ui/svg-icons/communication/import-contacts';
import EnrolledIcon from 'material-ui/svg-icons/action/account-circle';
import WaitingIcon from 'material-ui/svg-icons/social/people';
import BlockIcon from 'material-ui/svg-icons/content/block';
import FontAwesome from 'react-fontawesome';

const styles = {
	header: {
		padding: '10px 20px',
	  textAlign: 'left',
	},
	headerText: {
		marginLeft: 0,
	  fontSize: 30,
	  fontWeight: 400,
	},
	lastUpdated: {
		fontSize: 12,
		marginLeft: 2,
	},
	icon: {
		width: '20px',
		height: '20px',
		marginRight: '10px'
	},
	divider: {
		borderTop: '1px solid #eeeeee',
		backgroundColor: 'inherit'
	},
	info: {
		display: 'flex',
		margin: '10px 0',
	},
	infoDetails: {
		textAlign: 'left',
		fontSize: 15,
		padding: '10px 20px',
	},
	shareContainer: {
		textAlign: 'left',
		fontSize: 15,
		padding: '10px 20px',
	},
	note: {
		fontSize: 13,
	}
};

const Info = ({ icon, info }) => (
	<div style={ styles.info }>
		{icon}
		{info}
	</div>
);

const DetailedInfo = ({
	instructor,
	units,
	note,
	attending,
	enrollmentCap,
	waiting,
	waitingCap,
	reserved,
	reserveCap,
	reserveGroup,
}) => (
	<div style={ styles.infoDetails }>
		<Info
			icon={ <PersonIcon style={ styles.icon } /> }
			info={ `Instructor: ${instructor}` }
		/>
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
		{
			(note.length > 0) && (
				<i style={ styles.note }>{ `Note: ${note}` }</i>
			)
		}
	</div>
);

DetailedInfo.propTypes = {
	instructor: PropTypes.string.isRequired,
	units: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
	attending: PropTypes.number.isRequired,
  enrollmentCap: PropTypes.number.isRequired,
	waiting: PropTypes.number.isRequired,
  waitingCap: PropTypes.number.isRequired,
	reserved: PropTypes.number.isRequired,
	reserveCap: PropTypes.number.isRequired,
	reserveGroup: PropTypes.string.isRequired,
};

const Share = ({ icon, text }) => (
	<div style={ styles.shareContainer }>
		{ icon }
		<a className="course-info-share">{ text }</a>
	</div>
);


const CourseInfo = ({
	subject,
	catalogNumber,
	instructor,
	info,
	style
}) => {
	const {
		units,
		note,
		enrollmentCap,
		attending,
		waitingCap,
		waiting,
		reserveCap,
		reserved,
		reserveGroup,
		lastUpdated,
	} = info;

	return (
		<Paper style={ style } zDepth={ 1 }>
			<div style={ styles.header }>
				<span style={ styles.headerText }>Course Info</span><br />
				<span style={ styles.lastUpdated }>Last updated: { lastUpdated }</span>
			</div>
			<Divider style={ styles.divider } />
			<DetailedInfo
				instructor={ instructor }
				units={ units }
				note={ note }
				attending={ attending }
				enrollmentCap={ enrollmentCap }
				waiting={ waiting }
				waitingCap={ waitingCap }
				reserved={ reserved }
				reserveCap={ reserveCap }
				reserveGroup={ reserveGroup }
			/>
			<Divider style={ styles.divider } />
			<Share
				icon={ <FontAwesome name='facebook' style={ styles.icon } /> }
				text={ 'Share on Facebook' }
			/>
			<Divider style={ styles.divider } />
			<Share
				icon={ <FontAwesome name='twitter' style={ styles.icon } /> }
				text={ 'Share on Twitter' }
			/>
		</Paper>
	);
};

CourseInfo.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
	info: PropTypes.object.isRequired,
	style: PropTypes.object.isRequired,
}

export default CourseInfo;

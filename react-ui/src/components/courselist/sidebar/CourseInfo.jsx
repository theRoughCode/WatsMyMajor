import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import PersonIcon from 'material-ui/svg-icons/social/person';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import BlockIcon from 'material-ui/svg-icons/content/block';
import FontAwesome from 'react-fontawesome';

const styles = {
	icon: {
		width: '20px',
		height: '20px',
		marginRight: '10px'
	},
	divider: {
		borderTop: '1px solid #eeeeee',
		backgroundColor: 'inherit'
	}
};

const Info = ({ icon, info }) => (
	<div className="course-info-details-info">
		{icon}
		{info}
	</div>
);

const DetailedInfo = (info) => {
	const {
		instructor,
		attending,
		enrollmentCap,
		reserved,
		reservedCap
	} = info;

	return (
		<div className="course-info-details">
			<Info
				icon={<PersonIcon style={styles.icon} />}
				info={`Instructor: ${instructor}`}
			/>
			<Info
				icon={<PeopleIcon style={styles.icon} />}
				info={`Enrollment cap: ${enrollmentCap}`}
			/>
			<Info
				icon={<CheckIcon style={styles.icon} />}
				info={`Attending: ${attending}`}
			/>
			<Info
				icon={<BlockIcon style={styles.icon} />}
				info={`Reserved cap: ${reservedCap}`}
			/>
			<Info
				icon={<CheckIcon style={styles.icon} />}
				info={`Reserved enrolled: ${reserved}`}
			/>
		</div>
	);
};

DetailedInfo.propTypes = {
  instructor: PropTypes.string.isRequired,
	attending: PropTypes.string.isRequired,
  enrollmentCap: PropTypes.string.isRequired,
	reserved: PropTypes.string.isRequired,
	reservedCap: PropTypes.string.isRequired
};

const Share = ({ icon, text }) => (
	<div className="course-info-share">
		{icon}
		<a href="#">{text}</a>
	</div>
);


const CourseInfo = (props) => {
	const {
		style,
		subject,
		catalogNumber,
		instructor,
		attending,
		enrollmentCap,
		reserved,
		reservedCap,
		lastUpdated
	} = props;

	return (
		<Paper style={style} zDepth={1}>
			<div className="course-info-header">
				<span>Course Info</span><br />
				<span id="last-updated">Last updated: {lastUpdated}</span>
			</div>
			<Divider style={styles.divider} />
			<DetailedInfo
				instructor={instructor}
				attending={attending}
				enrollmentCap={enrollmentCap}
				reserved={reserved}
				reservedCap={reservedCap}
				/>
			<Divider style={styles.divider} />
			<Share
				icon={<FontAwesome
	        name='facebook'
					style={styles.icon}
	      />}
				text={'Share on Facebook'}
				/>
			<Divider style={styles.divider} />
			<Share
				icon={<FontAwesome
	        name='twitter'
					style={styles.icon}
	      />}
				text={'Share on Twitter'}
				/>
		</Paper>
	);
};

CourseInfo.propTypes = {
	style: PropTypes.object.isRequired,
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
	attending: PropTypes.string.isRequired,
  enrollmentCap: PropTypes.string.isRequired,
	reserved: PropTypes.string.isRequired,
	reservedCap: PropTypes.string.isRequired,
	lastUpdated: PropTypes.string.isRequired
}

export default CourseInfo;

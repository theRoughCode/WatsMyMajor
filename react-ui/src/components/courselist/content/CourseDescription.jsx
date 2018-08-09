import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import CourseRequisites from './CourseRequisites';

const styles = {
	leftContainer: {
		display: 'flex',
		flexDirection: 'column',
		marginLeft: 20,
	},
	description: {
		fontSize: 15,
	  margin: 'auto',
	  marginLeft: 0,
		marginBottom: 10,
	  textAlign: 'left',
	  lineHeight: 1.5,
	  color: '#5c6e84',
	},
	treeButton: {
		marginBottom: 20,
		width: '100%'
	},
}

const CourseDescription = ({
	subject,
	catalogNumber,
	description,
	crosslistings,
	antireqs,
	coreqs,
	prereqs,
	postreqs,
}) => (
	<div className="course-description">
		<div style={{ flex: 1 }}>
			{
				(crosslistings.length > 0) && (
					<p style={ styles.description }>{ `Crosslisted with: ${crosslistings}` }</p>
				)
			}
			<p style={ styles.description }>
				{ description }
			</p>
		</div>
		<div style={ styles.leftContainer }>
			<Link to={ `/tree/prereqs/${subject}/${catalogNumber}` }>
				<RaisedButton
					label="View Requisites Tree"
					style={ styles.treeButton }
				/>
			</Link>
			<CourseRequisites
				antireqs={ antireqs }
				coreqs={ coreqs }
				prereqs={ prereqs }
				postreqs={ postreqs }
			/>
		</div>
	</div>
);

CourseDescription.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  antireqs: PropTypes.array.isRequired,
  coreqs: PropTypes.array.isRequired,
  prereqs: PropTypes.object.isRequired,
  postreqs: PropTypes.array.isRequired,
};

export default CourseDescription;

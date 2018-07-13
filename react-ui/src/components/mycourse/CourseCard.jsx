import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

const isInPrereqs = (subject, catalogNumber, prereqs) => {
	for (var i = 0; i < prereqs.length; i++) {
		if (subject === prereqs[i].subject && catalogNumber === prereqs[i].catalogNumber) {
			return true;
		}
	}
	return false;
}

const CourseCard = ({
	course,
	courseCardPrereqs,
	provided,
	snapshot,
	getItemStyle
}) => {
	const { subject, catalogNumber, prereqs } = course;

	// Mark this card as selected if is a prereq of dragged card
	const isPrereq = isInPrereqs(subject, catalogNumber, courseCardPrereqs);

	return (
		<Paper zDepth={1}>
			<div
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				style={getItemStyle(
					snapshot.isDragging,
					isPrereq,
					provided.draggableProps.style,
				)}
			>
				{`${subject} ${catalogNumber}`}
			</div>
		</Paper>
	);
}

CourseCard.propTypes = {
	course: PropTypes.object.isRequired,

	// Redux
	courseCardPrereqs: PropTypes.array.isRequired,

	// DnD
	provided: PropTypes.object.isRequired,
	snapshot: PropTypes.object.isRequired,

	getItemStyle: PropTypes.func.isRequired
};

const mapStateToProps = ({ courseCardPrereqs }) => ({ courseCardPrereqs });

export default connect(mapStateToProps, null)(CourseCard);

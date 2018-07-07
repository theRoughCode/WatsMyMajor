import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { highlightPrereqs } from '../../actions/index';

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
	highlightPrereqsHandler,
	provided,
	snapshot,
	getItemStyle
}) => {
	const { subject, catalogNumber, prereqs } = course;

	const onMouseDown = (() => {
    // dragHandleProps might be null
    if (!provided.dragHandleProps) {
      return onMouseDown;
    }

    // creating a new onMouseDown function that calls highlightPrereqsHandler as
		// well as the drag handle one.
    return e => {
			// Mark this card as selected if card is being dragged
			highlightPrereqsHandler(prereqs);
      provided.dragHandleProps.onMouseDown(e);
    };
  })();

	const isPrereq = isInPrereqs(subject, catalogNumber, courseCardPrereqs);

	return (
		<Paper zDepth={1}>
			<div
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				onMouseDown={onMouseDown}
				style={getItemStyle(
					snapshot.isDragging,
					isPrereq,
					provided.draggableProps.style,
				)}
			>
				{`${subject} ${catalogNumber}`}
			</div>
			{provided.placeholder}
		</Paper>
	);
}

CourseCard.propTypes = {
	course: PropTypes.object.isRequired,

	// Redux
	courseCardPrereqs: PropTypes.array.isRequired,
	highlightPrereqsHandler: PropTypes.func.isRequired,

	// DnD
	provided: PropTypes.object.isRequired,
	snapshot: PropTypes.object.isRequired,

	getItemStyle: PropTypes.func.isRequired
};

const mapStateToProps = ({ courseCardPrereqs }) => ({ courseCardPrereqs });

const mapDispatchToProps = dispatch => ({
	highlightPrereqsHandler: (prereqs) => {
		console.log(prereqs)
		if (prereqs == null || prereqs.length === 0) return;
		dispatch(highlightPrereqs(prereqs));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseCard);

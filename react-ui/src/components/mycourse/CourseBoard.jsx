import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

const CourseBoard = ({
	subject,
	catalogNumber,
	provided,
	snapshot,
	getItemStyle
}) => (
	<Paper elevation={1}>
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			style={getItemStyle(
				snapshot.isDragging,
				provided.draggableProps.style,
			)}
		>
			{`${subject} ${catalogNumber}`}
		</div>
		{provided.placeholder}
	</Paper>
);

CourseBoard.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,

	// DnD
	provided: PropTypes.object.isRequired,
	snapshot: PropTypes.object.isRequired,

	getItemStyle: PropTypes.func.isRequired
};

export default CourseBoard;

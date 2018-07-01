import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCard from './CourseCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const space = 8;
const stylesConst = {
	minHeight: 200,
	height: 'auto',
	width: 200
};
const styles = {
	board: {
		margin: '20px auto',
		width:  stylesConst.width,
		minHeight: stylesConst.minHeight,
		height: stylesConst.height,
	},
	cartBoard: {
		margin: '20px auto',
		width:  stylesConst.width,
		height: stylesConst.height
	},
	dragArea: (isDraggingOver, isCart) => ({
		padding: space,
		width: stylesConst.width - space * 2,
		minHeight: stylesConst.minHeight,
		height: stylesConst.height,
		background: isDraggingOver ? '#fafcf2' : 'inherit'
	})
};


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: space * 2,
  margin: `0 0 ${space}px 0`,
	border: isDragging
		? '1px solid #4f4f4f'
		: '1px solid #bcbcbc',
	borderRadius: '5px',

  // change background colour if dragging
  background: isDragging ? '#8be58b' : '#f2f2f2',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const renderCourses = (courseList) => {
	return courseList.map((course, index) => {
		const key = `${course.subject}.${course.catalogNumber}-${index}`;
		return (
			<Draggable
				key={ key }
				draggableId={ key }
				index={index}
				type={DragTypes.COURSE}
				>
				{(provided, snapshot) => (
					<CourseCard
						subject={course.subject}
						catalogNumber={course.catalogNumber}
						provided={provided}
						snapshot={snapshot}
						getItemStyle={getItemStyle}
						/>
				)}
			</Draggable>
		);
	});
};

const TermBoard = ({ index, boardHeader, courses, isCart }) => (
	<Paper
		className="term-paper"
		zDepth={1}
		style={(isCart) ? styles.cartBoard : styles.board}
		>
		<div className="term-header">
			<span>{boardHeader}</span>
		</div>
		<div>
			<Droppable
				droppableId={index || boardHeader}
				type={DragTypes.COURSE}
			>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						style={styles.dragArea(snapshot.isDraggingOver, isCart)}
						>
						{renderCourses(courses)}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	</Paper>
);

TermBoard.propTypes = {
	index: PropTypes.string,
	boardHeader: PropTypes.string,
	courses: PropTypes.array,
	isCart: PropTypes.bool
};

TermBoard.defaultProps = {
	index: '',
	boardHeader: '',
	courses: [],
	isCart: false
};

export default TermBoard;

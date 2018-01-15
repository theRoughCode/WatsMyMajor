import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCard from './CourseCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const grid = 8;
const styles = {
	board: {
		margin: '20px',
		width: '200px',
		minHeight: '400px',
		height: 'auto',
	},
	dragArea: (isDraggingOver) => ({
		padding: grid,
		width: '180px',
	})
};


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
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
	return courseList.map((course, index) => (
			<Draggable
				key={index}
				draggableId={course.id}
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
	));
};


export default class TermPaper extends Component {

	static propTypes = {
		termNumber: PropTypes.string.isRequired,
		term: PropTypes.string.isRequired,
		year: PropTypes.string.isRequired,
		courses: PropTypes.array.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			termNumber: props.termNumber,
			term: props.term,
			year: props.year,
			courses: props.courses
		};
	}

	componentWillReceiveProps(nextProps) {
	  if (nextProps.courses !== this.state.courses) {
			this.setState({ courses: nextProps.courses });
		}
	}

	render() {
		return (
			<Paper
				className="term-paper"
				zDepth={1}
				style={styles.board}
				>
				<div className="term-header">
					<span>{this.state.termNumber}</span>
					<span className="year">{this.state.term} {this.state.year}</span>
				</div>
				<div>
					<Droppable
						droppableId={this.state.termNumber}
						type={DragTypes.COURSE}
						>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={styles.dragArea(snapshot.isDraggingOver)}
								>
								{renderCourses(this.state.courses)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			</Paper>
		);
	}

}

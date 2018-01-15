import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCard from './CourseCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const space = 8;
const stylesConst = {
	minHeight: '400px',
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
		height: '100%',
	},
	dragArea: (isDraggingOver, isCart) => ({
		padding: space,
		width: stylesConst.width - space * 2,
		minHeight: stylesConst.minHeight,
		height: (isCart) ? '100%' : stylesConst.height,

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
		boardHeader: PropTypes.string.isRequired,
		term: PropTypes.string,
		year: PropTypes.string,
		courses: PropTypes.array,
		isCart: PropTypes.bool
	};

	static defaultProps = {
		term: '',
		year: '',
		courses: [],
		isCart: false
	};

	constructor(props) {
		super(props);

		this.state = {
			boardHeader: props.boardHeader,
			term: props.term,
			year: props.year,
			courses: props.courses,
			isCart: props.isCart
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
				style={(this.state.isCart) ? styles.cartBoard : styles.board}
				>
				<div className="term-header">
					<span>{this.state.boardHeader}</span>
					<span className="year">{this.state.term} {this.state.year}</span>
				</div>
				<div style={{ height: '93%' }}>
					<Droppable
						droppableId={this.state.boardHeader}
						type={DragTypes.COURSE}
						>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={styles.dragArea(snapshot.isDraggingOver, this.state.isCart)}
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

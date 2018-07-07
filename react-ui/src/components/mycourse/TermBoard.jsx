import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
	header: {
		padding: '5px 0',
		marginBottom: 10,
		backgroundColor: 'rgb(54, 65, 80)',
		color: 'white',
		fontSize: 18,
		boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
		display: 'flex',
	},
	box: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	boardTitle: {
		flex: 2
	},
	editIcon: {
		color: 'white',
		marginLeft: 'auto'
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


const getItemStyle = (isDragging, isPrereq, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: space * 2,
  margin: `0 0 ${space}px 0`,
	border: (isDragging || isPrereq)
		? '1px solid #4f4f4f'
		: '1px solid #bcbcbc',
	borderRadius: '5px',

  // change background colour if dragging
  background: isDragging
		? '#8be58b'
		: isPrereq
			? '#9ef442'
			: '#f2f2f2',

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
						course={course}
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
		<div style={styles.header}>
			<div style={styles.box}>
			</div>
			<div style={{...styles.box, ...styles.boardTitle}}>
				<span>{boardHeader}</span>
			</div>
			<div style={styles.box}>
				<IconMenu
					iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
					anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
					targetOrigin={{horizontal: 'left', vertical: 'top'}}
					iconStyle={styles.editIcon}
					useLayerForClickAway
				>
					{
						isCart
							? <MenuItem primaryText="Clear Cart" />
						: (
								<div>
									<MenuItem primaryText="Edit Name" onClick={() => console.log('hi')} />
									<MenuItem primaryText="Clear Term" />
									<MenuItem primaryText="Delete Term" />
								</div>
							)
					}
				</IconMenu>
			</div>
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

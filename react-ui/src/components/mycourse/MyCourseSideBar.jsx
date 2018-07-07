import React from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import Button from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const width = 200;

const styles = {
	addButton: {
		width,
		margin: '10px auto'
	},
	trashContainer: {
		width,
		margin: '10px auto',
		height: '100px',
		display: 'flex'
	},
	droppableContainer: isDraggingOver => ({
		width,
		height: '96px',
		display: 'flex',
		margin: 'auto',
		border: (isDraggingOver) ? '2px dashed black' : 'none',
		background: (isDraggingOver) ? '#ff6666' : 'inherit'
	}),
	trashIcon: {
		margin: 'auto',
		fontSize: '40px'
	}
}

const Trash = () => (
	<Paper zDepth={1} style={styles.trashContainer}>
		<Droppable
			droppableId={'Trash'}
			type={DragTypes.COURSE}
		>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					style={styles.droppableContainer(snapshot.isDraggingOver)}
					>
					<FontIcon
						className="material-icons"
						style={styles.trashIcon}
					>
						{(snapshot.isDraggingOver)
							? 'delete_forever'
							: 'delete'
						}
					</FontIcon>
				</div>
			)}
		</Droppable>
	</Paper>
);


const MyCourseSideBar = ({ cartCourses }) => (
	<div className="cart">
		<Button
			onClick={() => {}}
			label="Add Term"
			backgroundColor="#a4c639"
			style={styles.addButton}
			icon={<AddIcon />}
		/>
		<Trash />
		<TermBoard
			boardHeader={'Cart'}
			courses={cartCourses}
			isCart={true}
		/>
	</div>
);

MyCourseSideBar.propTypes = {
	cartCourses: PropTypes.array.isRequired
};

export default MyCourseSideBar;

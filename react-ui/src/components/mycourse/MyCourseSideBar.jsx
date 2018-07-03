import React from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const width = 200;

const styles = {
	addButton: {
		width,
		margin: '10px auto',
		backgroundColor: '#a4c639',
		'&:hover': {
      backgroundColor: '#b3d83e',
    },
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
	<Paper elevation={1} style={styles.trashContainer}>
		<Droppable
			droppableId={'Trash'}
			type={DragTypes.COURSE}
			>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					style={styles.droppableContainer(snapshot.isDraggingOver)}
					>
					<Icon
						className="material-icons"
						style={styles.trashIcon}
					>
						{(snapshot.isDraggingOver)
							? 'delete_forever'
							: 'delete'
						}
					</Icon>
				</div>
			)}
		</Droppable>
	</Paper>
);


const MyCourseSideBar = ({ cartCourses, classes }) => (
	<div className="cart">
		<Button
			variant="contained"
			onClick={() => {}}
			className={classes.addButton}
		>
			<AddIcon />
			Add Term
		</Button>
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

export default withStyles(styles)(MyCourseSideBar);

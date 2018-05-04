import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';


const styles = {
	trashContainer: {
		width: '200px',
		margin: '10px auto',
		height: '100px',
		display: 'flex'
	},
	droppableContainer: isDraggingOver => ({
		width: '196px',
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


export default class Cart extends Component {

	static propTypes = {
		courses: PropTypes.array.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			courses: props.courses
		};

		this.addCourseHandler = props.addCourseHandler;
		this.removeCourseHandler = props.removeCourseHandler;
	}

	render() {
		return (
			<div className="cart">
				<Trash />
				<TermBoard
					boardHeader={'Cart'}
					courses={this.state.courses}
					isCart={true}
					/>
			</div>
		);
	}

}

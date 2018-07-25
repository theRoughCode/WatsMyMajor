import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TermBoard from './TermBoard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import Button from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const width = 200;

const styles = {
	container: {
		position: 'fixed',
		right: 0,
		marginRight: 0,
		width: '22%',
		display: 'flex',
		flexDirection: 'column',
	},
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

export default class MyCourseSideBar extends Component {

	static propTypes = {
		cartCourses: PropTypes.array.isRequired,
		onClearCart: PropTypes.func.isRequired,
		onAddBoard: PropTypes.func.isRequired,
	};

	state = {
		dialogOpen: false,
		text: ''
	};

	openDialog = () => this.setState({ dialogOpen: true });

	closeDialog = () => this.setState({ text: '', dialogOpen: false });

	onChangeText = (e, text) => this.setState({ text });

	onSubmit = () => {
		const { text } = this.state;
		this.props.onAddBoard(text);
		this.closeDialog();
	}

	render() {
		const { cartCourses, onClearCart } = this.props;
		const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.onSubmit}
      />,
    ];

		return (
			<div style={styles.container}>
				<Button
					onClick={this.openDialog}
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
					onClearBoard={onClearCart}
				/>
				<Dialog
          title="Add Term"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.closeDialog}
					contentStyle={{ width: 400 }}
        >
					<TextField
						hintText="e.g. Fall 2018"
						floatingLabelText="New Board Name"
						onChange={this.onChangeText}
					/>
        </Dialog>
			</div>
		);
	}
}

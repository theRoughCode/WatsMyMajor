import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CourseCard from './CourseCard';
import Parser from './ParseCourses';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';
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

export default class TermBoard extends Component {

	static propTypes = {
		index: PropTypes.string,
		boardHeader: PropTypes.string,
		courses: PropTypes.array,
		isCart: PropTypes.bool,
		onRenameBoard: PropTypes.func,
		onUpdateCourses: PropTypes.func,
		onDeleteBoard: PropTypes.func,
		onClearBoard: PropTypes.func.isRequired,
	};

	static defaultProps = {
		index: '',
		boardHeader: '',
		courses: [],
		isCart: false,
		onRenameBoard: () => null,
	};

	state = {
		renameDialogOpen: false,
		loadDialogOpen: false,
		settingsOpen: false,
		rename: '',
		loadText: ''
	};

	toggleSettings = (open) => this.setState({ settingsOpen: open });

	openRenameDialog = () => this.setState({ settingsOpen: false, renameDialogOpen: true });
	openLoadDialog = () => this.setState({ settingsOpen: false, loadDialogOpen: true });

	closeRenameDialog = () => this.setState({ rename: '', renameDialogOpen: false });
	closeLoadDialog = () => this.setState({ rename: '', loadDialogOpen: false });

	onChangeRenameText = (e, text) => this.setState({ rename: text });
	onChangeLoadText = (text) => this.setState({ loadText: text });

	onRename = () => {
		const { rename } = this.state;
		this.props.onRenameBoard(rename);
		this.closeRenameDialog();
	}

	onLoad = () => {
		const { loadText } = this.state;
		this.closeLoadDialog();

		fetch('/parse/courses', {
			method: 'POST',
			body: JSON.stringify({ text: loadText }),
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			if (!response.ok) throw new Error(`status ${response.status}`);
			else return response.json();
		}).then((termCourses) => {
			this.setState({ loading: false });
			const { courses } = termCourses;
			this.props.onUpdateCourses(courses);
		}).catch(err => alert(`Failed to parse your courses. Error: ${err.message}`));
	}

	clearBoard = () => {
		this.props.onClearBoard();
		this.toggleSettings(false);
	}

	deleteBoard = () => {
		this.props.onDeleteBoard();
		this.toggleSettings(false);
	}

	render() {
		const { index, boardHeader, courses, isCart } = this.props;

		const renameDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeRenameDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.onRename}
      />,
    ];

		const loadDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeLoadDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.onLoad}
      />,
    ];

		return (
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
							onRequestChange={this.toggleSettings}
							open={this.state.settingsOpen}
							useLayerForClickAway
						>
							{
								isCart
									? <MenuItem primaryText="Clear Cart" onClick={this.clearBoard} />
								: (
										<div>
											<MenuItem primaryText="Edit Name" onClick={this.openRenameDialog} />
											<MenuItem primaryText="Load Courses" onClick={this.openLoadDialog} />
											<MenuItem primaryText="Clear Term" onClick={this.clearBoard} />
											<MenuItem primaryText="Delete Term" onClick={this.deleteBoard} />
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
				<Dialog
          title="Rename Board"
          actions={renameDialogActions}
          modal={false}
          open={this.state.renameDialogOpen}
          onRequestClose={this.closeRenameDialog}
					contentStyle={{ width: 400 }}
        >
					<TextField
			      hintText="e.g. Fall 2018"
			      floatingLabelText="New Board Name"
						onChange={this.onChangeRenameText}
			    />
        </Dialog>
				<Dialog
          title="Load Courses"
          actions={loadDialogActions}
          modal={false}
          open={this.state.loadDialogOpen}
          onRequestClose={this.closeLoadDialog}
					contentStyle={{ width: 900, maxWidth: 'none', height: 600 }}
        >
					{ <Parser onChange={this.onChangeLoadText} /> }
        </Dialog>
			</Paper>
		);
	}
}

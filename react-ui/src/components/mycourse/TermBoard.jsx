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
import AddIcon from 'material-ui/svg-icons/content/add';
import CourseCard from './CourseCard';
import Parser from './ParseCourses';
import SearchBar from '../SearchBar';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DragTypes } from '../../constants/DragTypes';

const space = 8;
const stylesConst = {
	minHeight: 200,
	height: 'auto',
	width: 200
};
const styles = {
	board: {
		margin: 10,
		width:  stylesConst.width,
		minHeight: stylesConst.minHeight,
		height: stylesConst.height,
	},
	header: (isDragging) => ({
		padding: '5px 0',
		marginBottom: 10,
		backgroundColor: isDragging ? 'rgb(82, 110, 150)' : 'rgb(54, 65, 80)',
		color: 'white',
		fontSize: 18,
		boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
		display: 'flex',
	}),
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
		maxHeight: isCart ? 400 : 'none',
		height: stylesConst.height,
		background: isDraggingOver ? '#bde580' : 'inherit',
		overflow: isCart ? 'auto' : 'none',
	}),
	addCourseCard: {
		padding: space,
		margin: `0 0 ${space}px 0`,
		border: '1px dashed #bcbcbc',
		borderRadius: '5px',
		cursor: 'pointer',
		width: '100%',
		height: 'auto',
	},
	addIcon: {
		width: 40,
		height: 40,
		cursor: 'pointer',
	}
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

const AddCourseCard = ({ onClick }) => (
	<FlatButton style={ styles.addCourseCard } onClick={ onClick } >
		<div style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
			<AddIcon style={ styles.addIcon } />
		</div>
	</FlatButton>
);

const renderCourses = (showAdd, courseList, onClick) => {
	const courses = courseList.map((course, index) => {
		const key = `${course.subject}/${course.catalogNumber}/${index}`;
		return (
			<Draggable
				key={ key }
				draggableId={ key }
				index={ index }
				type={ DragTypes.COURSE }
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
	// Add "Add courses" button if not a cart
	if (showAdd) courses.push(<AddCourseCard key='add-course' onClick={ onClick } />);
	return courses;
};

export default class TermBoard extends Component {

	static propTypes = {
		index: PropTypes.string,
		boardHeader: PropTypes.string,
		courses: PropTypes.array,
		provided: PropTypes.object,
		snapshot: PropTypes.object,
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
		provided: {},
		snapshot: {},
		isCart: false,
		onUpdateCourses: () => null,
		onRenameBoard: () => null,
	};

	state = {
		renameDialogOpen: false,
		importDialogOpen: false,
		addDialogOpen: false,
		settingsOpen: false,
		rename: '',
		importText: ''
	};

	toggleSettings = (open) => this.setState({ settingsOpen: open });

	openRenameDialog = () => this.setState({ settingsOpen: false, renameDialogOpen: true });
	openImportDialog = () => this.setState({ settingsOpen: false, importDialogOpen: true });
	openAddDialog = () => this.setState({ settingsOpen: false, addDialogOpen: true });

	closeRenameDialog = () => this.setState({ rename: '', renameDialogOpen: false });
	closeImportDialog = () => this.setState({ rename: '', importDialogOpen: false });
	closeAddDialog = () => this.setState({ rename: '', addDialogOpen: false });

	onChangeRenameText = (e, text) => this.setState({ rename: text });
	onChangeImportText = (text) => this.setState({ importText: text });

	onRename = () => {
		const { rename } = this.state;
		this.props.onRenameBoard(rename);
		this.closeRenameDialog();
	}

	onImport = () => {
		const { importText } = this.state;
		this.closeImportDialog();

		fetch('/server/parse/courses', {
			method: 'POST',
			body: JSON.stringify({ text: importText }),
			headers: {
				'content-type': 'application/json',
				'x-secret': process.env.REACT_APP_SERVER_SECRET
			}
		}).then(response => {
			if (!response.ok) throw new Error(`status ${response.status}`);
			else return response.json();
		}).then((termCourses) => {
			this.setState({ importing: false });
			const { courses } = termCourses;
			this.props.onUpdateCourses(courses);
		}).catch(err => alert(`Failed to parse your courses. Error: ${err.message}`));
	}

	onSearchResult = (subject, catalogNumber) => {
		this.props.onUpdateCourses([{ subject, catalogNumber }])
		this.closeAddDialog();
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
		const droppableId = (isCart) ? 'Cart' : index;

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

		const importDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeImportDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.onImport}
      />,
    ];

		const addDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeAddDialog}
      />,
    ];

		let innerRef = null;
		let draggableProps = [];
		let dragHandleProps = [];
		let isDragging = false;
		if (this.props.provided.hasOwnProperty('innerRef')) {
			innerRef = this.props.provided.innerRef;
			draggableProps = this.props.provided.draggableProps;
			dragHandleProps = this.props.provided.dragHandleProps;
		}
		if (this.props.snapshot.hasOwnProperty('isDragging')) {
			isDragging = this.props.snapshot.isDragging;
		}

		return (
			<div ref={innerRef} {...draggableProps}>
				<Paper
					className="term-paper"
					zDepth={1}
					style={(isCart) ? styles.cartBoard : styles.board}
				>
					<div style={styles.header(isDragging)} {...dragHandleProps}>
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
												<MenuItem primaryText="Import Courses" onClick={this.openImportDialog} />
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
							droppableId={ droppableId }
							type={ DragTypes.COURSE }
						>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									style={styles.dragArea(snapshot.isDraggingOver, isCart)}
								>
									{ renderCourses(!isCart && !snapshot.isDraggingOver, courses, this.openAddDialog) }
									{ provided.placeholder }
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
						title="Import Courses"
						actions={importDialogActions}
						modal={false}
						open={this.state.importDialogOpen}
						onRequestClose={this.closeImportDialog}
						contentStyle={{ width: 900, maxWidth: 'none', height: 600 }}
					>
						{ <Parser onChange={this.onChangeImportText} /> }
					</Dialog>
					<Dialog
						title="Add Course"
						actions={addDialogActions}
						modal={false}
						open={this.state.addDialogOpen}
						onRequestClose={this.closeAddDialog}
					>
						<SearchBar onResult={this.onSearchResult} />
					</Dialog>
				</Paper>
			</div>
		);
	}
}

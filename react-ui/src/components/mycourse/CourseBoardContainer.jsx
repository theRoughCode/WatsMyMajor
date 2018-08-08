import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import MyCourseSideBar from './MyCourseSideBar';
import TermRow from './TermRow';
import { DragTypes } from '../../constants/DragTypes';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { hasTakenCourse } from '../../utils/courses';
import {
	reorderUserCourses,
	updateUserCourses,
	reorderCart,
	unhighlightPrereqs,
	highlightPrereqs,
	createSnack
} from '../../actions';

const NUM_PER_ROW = 3;
const styles = {
	viewContainer: {
		width: '100%',
	  display: 'flex',
	  paddingTop: 20,
	},
	boardContainer: {
		width: '70%',
	  padding: '30px 60px',
		display: 'flex',
	},
	termRowContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	emptyContainer: {
		width: '90%',
		height: '90%',
		margin: 'auto',
		border: '2px dashed #888e99',
		borderRadius: 20,
		display: 'flex',
		flexDirection: 'column',
	},
	emptyInnerDiv: {
		margin: 'auto',
		display: 'flex',
		flexDirection: 'column',
	},
	emptyImage: {
		margin: 'auto',
	},
	emptyTextDiv: {
		margin: 'auto',
		marginTop: 50,
		display: 'flex',
		flexDirection: 'column',
	},
	emptyTextTitle: {
		fontSize: 25,
	},
	emptyTextSubtitle: {
		fontSize: 22,
		color: '#888e99',
	}
}

class CourseBoardContainer extends Component {

	static propTypes = {
		courseList: PropTypes.array.isRequired,
		myCourses: PropTypes.object.isRequired,
		cart: PropTypes.array.isRequired,
		username: PropTypes.string.isRequired,
		updateCourseHandler: PropTypes.func.isRequired,
		reorderCartHandler: PropTypes.func.isRequired,
		deselectCourseHandler: PropTypes.func.isRequired,
		highlightPrereqsHandler: PropTypes.func.isRequired,
		sendDuplicateCourseSnack: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		const {
			courseList,
			cart,
			username,
			updateCourseHandler,
			reorderCourseHandler,
			reorderCartHandler,
			deselectCourseHandler,
		} = props;

		this.state = {
			courseList,
			cart,
			username,
		};

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragTerm = this.onDragTerm.bind(this);
		this.onDragCourse = this.onDragCourse.bind(this);
		this.move = this.move.bind(this);
		this.loadCourses = this.loadCourses.bind(this);
		this.clearCart = this.clearCart.bind(this);
		this.reorderTerm = this.reorderTerm.bind(this);
		this.getBoard = this.getBoard.bind(this);
		this.updateBoard = this.updateBoard.bind(this);
		this.renameBoard = this.renameBoard.bind(this);
		this.addBoard = this.addBoard.bind(this);
		this.clearBoard = this.clearBoard.bind(this);
		this.deleteBoard = this.deleteBoard.bind(this);
		this.renderBoard = this.renderBoard.bind(this);
		this.updateCourseHandler = updateCourseHandler;
		this.reorderCourseHandler = reorderCourseHandler;
		this.reorderCartHandler = reorderCartHandler;
		this.deselectCourseHandler = deselectCourseHandler;
	}

	componentWillReceiveProps(nextProps) {
	  if (!arrayOfObjectEquals(nextProps.courseList, this.state.courseList)) {
			this.setState({ courseList: nextProps.courseList });
		}
		if (!arrayOfObjectEquals(nextProps.cart, this.state.cart)) {
			this.setState({ cart: nextProps.cart });
		}
		if (nextProps.username !== this.state.username) {
			this.setState({ username: nextProps.username });
		}
	}

	getTermList(id) {
		return this.state.courseList[id].courses;
	}

	// Highlight prereqs when dragging a course card
	onDragStart(start) {
		if (start.type !== DragTypes.COURSE) return;
		const splitId = start.draggableId.split("/");
		if (splitId.length < 3) return;
		const [ subject, catalogNumber ] = splitId;
		let prereqs = [];
		switch (start.source.droppableId) {
			case "Cart":
				prereqs = this.state.cart[start.source.index].prereqs || [];
				break;
			default:
				if (this.props.myCourses.hasOwnProperty(subject)
						&& this.props.myCourses[subject].hasOwnProperty(catalogNumber)) {
					prereqs = this.props.myCourses[subject][catalogNumber];
				}
		}
		if (prereqs.length === 0) return;
		this.props.highlightPrereqsHandler(prereqs);
	}

	onDragEnd(result) {
		const { source, destination } = result;
		this.deselectCourseHandler();

		// dropped outside the list
		if (!destination) return;

		switch (result.type) {
			case DragTypes.COLUMN:
				this.onDragTerm(source, destination);
				break;
			case DragTypes.COURSE:
				this.onDragCourse(source, destination);
				break;
			default:
		}
	}

	// Called when a term is being dragged
	onDragTerm(source, destination) {
		const fromRowNum = Number(source.droppableId.split('/')[1]);
		const toRowNum = Number(destination.droppableId.split('/')[1]);
		const fromIndex = source.index + fromRowNum * NUM_PER_ROW;
		// Offset by 1 when moving from a lower number to higher because the indices
		// have not been reshuffled yet to account for the blank space in the lower row.
		const offsetNum = (fromRowNum < toRowNum) ? 1 : 0;
		const toIndex = destination.index + toRowNum * NUM_PER_ROW - offsetNum;

		if (fromIndex === toIndex) return;
		const { username, courseList } = this.state;
		const [removed] = courseList.splice(fromIndex, 1);
		courseList.splice(toIndex, 0, removed);
		this.setState({ courseList });
		this.reorderCourseHandler(username, courseList);
	}

	// Called when a course is being dragged
	onDragCourse(source, destination) {
		if (source.droppableId === destination.droppableId) {
			this.reorderTerm(source.droppableId, source.index, destination.index);
		} else {
			this.move(source, destination);
		}
	}

	// Retrieves board
	getBoard(id) {
		switch (id) {
			case 'Cart':
				return this.state.cart;
			case 'Trash':
				return null;
			default:
				return this.state.courseList[id].courses || [];
		}
	}

	// Updates the board
	updateBoard(id, board) {
		switch (id) {
			case 'Cart':
				this.setState({ cart: board });
				this.reorderCartHandler(this.state.username, board);
				break;
			case 'Trash': break;
			default:
				const { username, courseList } = this.state;
				courseList[id].courses = board;
				this.setState({ courseList });
				this.reorderCourseHandler(username, courseList);
		}
	}

	// Reorder term board
	reorderTerm(id, fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const board = this.getBoard(id);
		const [removed] = board.splice(fromIndex, 1);
		board.splice(toIndex, 0, removed);
		this.updateBoard(id, board);
	}

	// Move an item between terms
	move(source, dest) {
		const sourceBoard = this.getBoard(source.droppableId);
		const destBoard = this.getBoard(dest.droppableId);
		const [removed] = sourceBoard.splice(source.index, 1);
		if (destBoard) destBoard.splice(dest.index, 0, removed);
		this.updateBoard(source.droppableId, sourceBoard);
		this.updateBoard(dest.droppableId, destBoard);
	}

	renameBoard(id, name) {
		const { username, courseList } = this.state;
		courseList[id].term = name;
		this.setState({ courseList });
		this.reorderCourseHandler(username, courseList);
	}

	clearBoard(id) {
		const { username, courseList } = this.state;
		courseList[id].courses = [];
		this.setState({ courseList });
		this.reorderCourseHandler(username, courseList);
	}

	clearCart() {
		this.setState({ cart: [] });
		this.reorderCartHandler(this.state.username, []);
	}

	addBoard(name) {
		const { username, courseList } = this.state;
		courseList.push({ term: name, courses: [] });
		this.setState({ courseList });
		this.reorderCourseHandler(username, courseList);
	}

	loadCourses(id, newCourses) {
		const { username, courseList } = this.state;
		let courses = courseList[id].courses || [];

		// Dedup courses
		newCourses = newCourses.filter(({ subject, catalogNumber}) => {
			const hasTaken = hasTakenCourse(subject, catalogNumber, this.props.myCourses);
			if (hasTaken) this.props.sendDuplicateCourseSnack(subject, catalogNumber);
			return !hasTaken;
		});
		if (newCourses.length === 0) return;

		courses = courses.concat(newCourses);
		courseList[id].courses = courses;

		this.setState({ courseList });
		this.updateCourseHandler(username, courseList);
	}

	deleteBoard(id) {
		const { username, courseList } = this.state;
		courseList.splice(id, 1);
		this.setState({ courseList });
		this.reorderCourseHandler(username, courseList);
	}

	renderBoard() {
		const { courseList } = this.state;
		const numTerms = courseList.length;

		// Empty board
		if (numTerms === 0) {
			return (
				<div style={ styles.emptyContainer }>
					<div style={ styles.emptyInnerDiv }>
						<img src="images/empty_board.png" alt="Empty Board" style={ styles.emptyImage } />
						<div style={ styles.emptyTextDiv }>
							<span style={ styles.emptyTextTitle }>
								Oops, looks like there's nothing here yet.
							</span><br />
							<span style={ styles.emptyTextSubtitle }>
								Add a term or add courses to your cart!
							</span>
						</div>
					</div>
				</div>
			);
		}

		const numRows = Math.ceil(numTerms / 3);
		return (
			<div style={ styles.termRowContainer }>
				{
					Array(numRows).fill().map((_, i) => {
						const courses = courseList.slice(i * NUM_PER_ROW, (i + 1) * NUM_PER_ROW);
						return (
							<TermRow
								key={ i }
								rowNumber={ i }
								courseList={ courses }
								onClearBoard={ this.clearBoard }
								onRenameBoard={ this.renameBoard }
								onDeleteBoard={ this.deleteBoard }
								onUpdateCourses={ this.loadCourses }
							/>
						)
					})
				}
			</div>
		);
	}

	render() {
		return (
			<DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
				<div style={ styles.viewContainer }>
					<div style={ styles.boardContainer }>
						{ this.renderBoard() }
					</div>
					<MyCourseSideBar
						cartCourses={ this.state.cart }
						onClearCart={ this.clearCart }
						onAddBoard={ this.addBoard }
					/>
				</div>
			</DragDropContext>
		);
	}
}

const mapStateToProps = ({ courseList, cart, user, myCourses }) => {
	const { username } = user;
	return { courseList, cart, username, myCourses };
};

const mapDispatchToProps = dispatch => {
	return {
		updateCourseHandler: (username, courseList) => {
			dispatch(updateUserCourses(username, courseList));
		},
		reorderCourseHandler: (username, courseList) => {
			dispatch(reorderUserCourses(username, courseList));
		},
		reorderCartHandler: (username, cart) => {
			dispatch(reorderCart(username, cart));
		},
		deselectCourseHandler: () => {
			dispatch(unhighlightPrereqs());
		},
		highlightPrereqsHandler: (prereqs) => {
			if (prereqs == null || prereqs.length === 0) return;
			dispatch(highlightPrereqs(prereqs));
		},
		sendDuplicateCourseSnack: (subject, catalogNumber) => {
			const msg = `${subject} ${catalogNumber} was removed as it was a duplicate.`;
			dispatch(createSnack(msg))
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseBoardContainer));

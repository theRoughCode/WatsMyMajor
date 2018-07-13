import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TermBoard from './TermBoard';
import MyCourseSideBar from './MyCourseSideBar';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { hasTakenCourse } from '../../utils/courses';
import {
	reorderUserCourses,
	reorderCart,
	unhighlightPrereqs,
	createSnack
} from '../../actions';
import { DragTypes } from '../../constants/DragTypes';

const styles = {
	boardContainer: {
		width: '70%',
	  height: '90%',
	  padding: '30px 60px',
		display: 'flex',
	},
	board: {
		width: '100%',
		display: 'flex',
		overflowX: 'auto',
		overflowY: 'hidden',
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
		sendDuplicateCourseSnack: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		const {
			courseList,
			cart,
			username,
			updateCourseHandler,
			reorderCartHandler,
			deselectCourseHandler,
			sendDuplicateCourseSnack,
		} = props;

		this.state = {
			courseList,
			cart,
			username,
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragTerm = this.onDragTerm.bind(this);
		this.onDragCourse = this.onDragCourse.bind(this);
		this.getBoard = this.getBoard.bind(this);
		this.updateBoard = this.updateBoard.bind(this);
		this.reorderTerm = this.reorderTerm.bind(this);
		this.move = this.move.bind(this);
		this.renderTerms = this.renderTerms.bind(this);
		this.clearCart = this.clearCart.bind(this);
		this.addBoard = this.addBoard.bind(this);
		this.updateCourseHandler = updateCourseHandler;
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
		}
	}

	onDragTerm(source, destination) {
		const fromIndex = source.index;
		const toIndex = destination.index;
		if (fromIndex === toIndex) return;
		const { username, courseList } = this.state;
		const [removed] = courseList.splice(fromIndex, 1);
		courseList.splice(toIndex, 0, removed);
		this.setState({ courseList });
		this.updateCourseHandler(username, courseList);
	}

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
				this.updateCourseHandler(username, courseList);
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

	// Move an item between lists
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
		this.updateCourseHandler(username, courseList);
	}

	clearBoard(id) {
		const { username, courseList } = this.state;
		courseList[id].courses = [];
		this.setState({ courseList });
		this.updateCourseHandler(username, courseList);
	}

	clearCart() {
		this.setState({ cart: [] });
		this.reorderCartHandler(this.state.username, []);
	}

	addBoard(name) {
		const { username, courseList } = this.state;
		courseList.push({ term: name, courses: [] });
		this.setState({ courseList });
		this.updateCourseHandler(username, courseList);
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
		this.updateCourseHandler(username, courseList);
	}

	renderTerms(courseList) {
		return courseList.map(({ term, courses }, index) => (
			<Draggable
				draggableId={ `term-${index}` }
				type={ DragTypes.COLUMN }
				index={ index }
				key={ index }
			>
				{(provided, snapshot) => (
					<TermBoard
						index={ index.toString() }
						boardHeader={ term }
						courses={ courses }
						provided={ provided }
						snapshot={ snapshot }
						onClearBoard={ this.clearBoard.bind(this, index) }
						onRenameBoard={ this.renameBoard.bind(this, index) }
						onDeleteBoard={ this.deleteBoard.bind(this, index) }
						onUpdateCourses={ this.loadCourses.bind(this, index) }
					/>
				)}
			</Draggable>
		));
	};

	render() {
		const { courseList } = this.state;
		const mainBoard = (courseList.length === 0)
			?  (
					<div style={ styles.emptyContainer }>
						<div style={ styles.emptyInnerDiv }>
							<img src="images/empty_board.png" style={ styles.emptyImage } />
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
				)
			: (
					<Droppable
						droppableId="board"
						type={ DragTypes.COLUMN }
						direction="horizontal"
					>
						{(provided, snapshot) => (
							<div
								ref={ provided.innerRef }
								{...provided.droppableProps}
								style={ styles.board }
							>
								{ this.renderTerms(courseList) }
								{ provided.placeholder }
							</div>
						)}
					</Droppable>
				);

		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-view">
					<div style={ styles.boardContainer }>
						{ mainBoard }
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
			dispatch(reorderUserCourses(username, courseList));
		},
		reorderCartHandler: (username, cart) => {
			dispatch(reorderCart(username, cart));
		},
		deselectCourseHandler: () => {
			dispatch(unhighlightPrereqs());
		},
		sendDuplicateCourseSnack: (subject, catalogNumber) => {
			const msg = `${subject} ${catalogNumber} was removed as it was a duplicate.`;
			dispatch(createSnack(msg))
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseBoardContainer));

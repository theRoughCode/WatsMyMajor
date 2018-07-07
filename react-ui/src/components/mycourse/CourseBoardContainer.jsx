import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TermBoard from './TermBoard';
import MyCourseSideBar from './MyCourseSideBar';
import { DragDropContext } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';


class CourseBoard extends Component {

	static propTypes = {
		courseList: PropTypes.array,
		cart: PropTypes.array.isRequired,
		updateCourseHandler: PropTypes.func.isRequired,
		reorderCartHandler: PropTypes.func.isRequired,
		deselectCourseHandler: PropTypes.func.isRequired,
	};

	static defaultProps = {
		courseList: []
	};

	constructor(props) {
		super(props);

		const {
			courseList,
			cart,
			updateCourseHandler,
			reorderCartHandler,
			deselectCourseHandler,
		} = props;

		this.state = {
			courseList,
			cart,
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.getBoard = this.getBoard.bind(this);
		this.updateBoard = this.updateBoard.bind(this);
		this.reorder = this.reorder.bind(this);
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
	}

	getTermList(id) {
		return this.state.courseList[id].courses;
	}

	onDragEnd(result) {
		const { source, destination } = result;
		this.deselectCourseHandler();

		// dropped outside the list
		if (!destination) return;

		if (source.droppableId === destination.droppableId) {
			this.reorder(source.droppableId, source.index, destination.index);
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
				this.reorderCartHandler(board);
				break;
			case 'Trash': break;
			default:
				const { courseList } = this.state;
				courseList[id].courses = board;
				this.setState({ courseList });
				this.updateCourseHandler(courseList);
		}
	}

	// Reorder term board
	reorder(id, fromIndex, toIndex) {
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
		const { courseList } = this.state;
		courseList[id].term = name;
		this.setState({ courseList });
		this.updateCourseHandler(courseList);
	}

	clearBoard(id) {
		const { courseList } = this.state;
		courseList[id].courses = [];
		this.setState({ courseList });
		this.updateCourseHandler(courseList);
	}

	clearCart() {
		this.setState({ cart: [] });
		this.reorderCartHandler([]);
	}

	addBoard(name) {
		const { courseList } = this.state;
		courseList.push({ term: name, courses: [] });
		this.setState({ courseList });
		this.updateCourseHandler(courseList);
	}

	deleteBoard(id) {
		const { courseList } = this.state;
		courseList.splice(id, 1);
		this.setState({ courseList });
		this.updateCourseHandler(courseList);
	}

	renderTerms(courseList) {
		return this.state.courseList.map(({ term, courses }, index) => (
			<TermBoard
				key={ index }
				index={ index.toString() }
				boardHeader={ term }
				courses={ courses }
				onClearBoard={ this.clearBoard.bind(this, index) }
				onRenameBoard={ this.renameBoard.bind(this, index) }
				onDeleteBoard={ this.deleteBoard.bind(this, index) }
			/>
		));
	};

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-view">
					<div className="course-board">
						{ this.renderTerms() }
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

export default withRouter(CourseBoard);

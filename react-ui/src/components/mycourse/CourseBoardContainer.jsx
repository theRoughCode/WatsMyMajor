import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TermBoard from './TermBoard';
import MyCourseSideBar from './MyCourseSideBar';
import { DragDropContext } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { reorderCart } from '../../actions/index';


const renderTerms = (courseList) => {
	return courseList.map(({ term, courses }, index) => (
		<TermBoard
			key={ index }
			index={ index.toString() }
			boardHeader={ term }
			courses={ courses }
		/>
	));
};


class CourseBoard extends Component {

	static propTypes = {
		updateCourseHandler: PropTypes.func.isRequired,
		cart: PropTypes.array.isRequired,
		reorderCartHandler: PropTypes.func.isRequired,
		courseList: PropTypes.array,
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
			addCourseHandler,
			removeCourseHandler,
			reorderCartHandler
		} = props;

		this.state = {
			courseList,
			cart
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.getBoard = this.getBoard.bind(this);
		this.updateBoard = this.updateBoard.bind(this);
		this.reorder = this.reorder.bind(this);
		this.move = this.move.bind(this);
		this.updateCourseHandler = updateCourseHandler;
		this.reorderCartHandler = reorderCartHandler;
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
		const { courseList } = this.state;
		const { source, destination } = result;
		// dropped outside the list
		if (!destination) {
			return;
		}

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

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-view">
					<div className="course-board">
						{renderTerms(this.state.courseList)}
					</div>
					<MyCourseSideBar cartCourses={this.state.cart} />
				</div>
			</DragDropContext>
		);
	}

}

const mapDispatchToProps = dispatch => {
	return {
		reorderCartHandler: cart => {
			dispatch(reorderCart(cart));
		}
	};
};

export default withRouter(connect(null, mapDispatchToProps)(CourseBoard));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TermBoard from './TermBoard';
import MyCourseSideBar from './MyCourseSideBar';
import { DragDropContext } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { reorderUserCourses, reorderCart, unhighlightPrereqs } from '../../actions';

const styles = {
	board: {
		width: '70%',
	  height: '100%',
	  display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
	  padding: '0 60px',
	},
	noItems: {
		width: '90%',
		height: '90%',
		margin: 'auto',
		border: '2px dashed black',
		borderRadius: 20,
	}
}

class CourseBoardContainer extends Component {

	static propTypes = {
		courseList: PropTypes.array,
		cart: PropTypes.array.isRequired,
		username: PropTypes.string.isRequired,
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
			username,
			updateCourseHandler,
			reorderCartHandler,
			deselectCourseHandler,
		} = props;

		this.state = {
			courseList,
			cart,
			username,
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
				const { username, courseList } = this.state;
				courseList[id].courses = board;
				this.setState({ courseList });
				this.updateCourseHandler(username, courseList);
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
		this.reorderCartHandler([]);
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
		courses = courses.concat(newCourses);
		// Dedup courses
		const courseMap = {};
		courses.forEach(course => courseMap[`${course.subject}${course.catalogNumber}`] = course);
		courses = Object.values(courseMap);
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
		if (courseList.length === 0) {
			return (
				<div style={ styles.noItems }></div>
			);
		}

		return courseList.map(({ term, courses }, index) => (
			<TermBoard
				key={ index }
				index={ index.toString() }
				boardHeader={ term }
				courses={ courses }
				onClearBoard={ this.clearBoard.bind(this, index) }
				onRenameBoard={ this.renameBoard.bind(this, index) }
				onDeleteBoard={ this.deleteBoard.bind(this, index) }
				onUpdateCourses={ this.loadCourses.bind(this, index) }
			/>
		));
	};

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-view">
					<div style={ styles.board }>
						{ this.renderTerms(this.state.courseList) }
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

const mapStateToProps = ({ courseList, cart, user }) => {
	const { username } = user;
	return { courseList, cart, username };
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
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseBoardContainer));

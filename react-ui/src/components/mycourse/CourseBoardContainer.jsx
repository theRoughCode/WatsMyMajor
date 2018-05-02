import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TermBoard from './TermBoard';
import CourseCard from './CourseCard';
import Cart from './Cart';
import { DragDropContext } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';
import { addToCart, removeFromCart, reorderCart } from '../../actions/index';


const renderTerms = (courseList) => {
	return Object.entries(courseList).map((kv, index) => {
		const boardHeader = kv[0];
		const { term, year, courses } = kv[1];

		return (
			<TermBoard
				key={index}
				boardHeader={boardHeader}
				term={term}
				year={year}
				courses={courses}
				/>
		);
	});
}


class CourseBoard extends Component {

	static propTypes = {
		courseList: PropTypes.object.isRequired,
		updateCourseHandler: PropTypes.func.isRequired,
		cart: PropTypes.array.isRequired,
		addCourseHandler: PropTypes.func.isRequired,
		removeCourseHandler: PropTypes.func.isRequired,
		reorderCartHandler: PropTypes.func.isRequired
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

		for (let term in courseList) {
			if (courseList[term].courses.length > 0)
				courseList[term].courses = courseList[term].courses.map(course => {
					course['id'] = uuidv4();
					return course;
				});
		}

		this.state = {
			courseList,
			cart
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.reorder = this.reorder.bind(this);
		this.updateCourseHandler = updateCourseHandler;
		this.addCourseHandler = addCourseHandler;
		this.removeCourseHandler = removeCourseHandler;
		this.reorderCartHandler = reorderCartHandler;
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const courseList = this.reorder(
			result.source,
			result.destination
		);

		this.updateCourseHandler(courseList);
	}

	// Reorder courses in term board
	reorder(source, dest) {
		const { courseList, cart } = this.state;

		const sourceArr = (source.droppableId === 'Cart')
			? cart
			: courseList[source.droppableId].courses;

		// Deleted course
		if (dest.droppableId === 'Trash') {
			sourceArr.splice(sourceIndex, 1);
			if (source.droppableId === 'Cart')
				this.reorderCartHandler(sourceArr);
			else courseList[source.droppableId].courses = sourceArr;
			return courseList;
		}


		const destArr = (dest.droppableId === 'Cart')
			? cart
			: courseList[dest.droppableId].courses;

		const sourceIndex = source.index;
		const destIndex = dest.index;

		const [ course ] = sourceArr.splice(sourceIndex, 1);
		destArr.splice(destIndex, 0, course);

		if (source.droppableId !== 'Cart')
			courseList[source.droppableId].courses = sourceArr;
		if (dest.droppableId !== 'Cart')
			courseList[dest.droppableId].courses = destArr;

		if (source.droppableId === 'Cart' || dest.droppableId == 'Cart')
			this.reorderCartHandler(sourceArr);

		return courseList;
	};

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<div className="course-view">
					<div className="course-board">
						{renderTerms(this.state.courseList)}
					</div>
					<Cart courses={this.state.cart} />
				</div>
			</DragDropContext>
		);
	}

}

const mapDispatchToProps = dispatch => {
	return {
		addCourseHandler: course => {
			dispatch(addToCart(course));
		},
		removeCourseHandler: id => {
			dispatch(removeFromCart(id));
		},
		reorderCartHandler: cart => {
			dispatch(reorderCart(cart));
		}
	};
};

export default withRouter(connect(null, mapDispatchToProps)(CourseBoard));

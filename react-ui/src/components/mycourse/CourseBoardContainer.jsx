import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TermBoard from './TermBoard';
import Cart from './Cart';
import { DragDropContext } from 'react-beautiful-dnd';
import { arrayOfObjectEquals } from '../../utils/arrays';
import { addToCart, removeFromCart, reorderCart } from '../../actions/index';


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
		addCourseHandler: PropTypes.func.isRequired,
		removeCourseHandler: PropTypes.func.isRequired,
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
		this.reorder = this.reorder.bind(this);
		this.updateCourseHandler = updateCourseHandler;
		this.addCourseHandler = addCourseHandler;
		this.removeCourseHandler = removeCourseHandler;
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
		const sourceIndex = source.index;
		const destIndex = dest.index;

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

		const [ course ] = sourceArr.splice(sourceIndex, 1);
		destArr.splice(destIndex, 0, course);

		if (source.droppableId !== 'Cart')
			courseList[source.droppableId].courses = sourceArr;
		if (dest.droppableId !== 'Cart')
			courseList[dest.droppableId].courses = destArr;

		if (source.droppableId === 'Cart' || dest.droppableId === 'Cart')
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { arrayOfObjectEquals } from '../../utils/arrays';
import CourseBoard from './CourseBoardContainer';
import { reorderUserCourses, reorderCart, unhighlightPrereqs } from '../../actions/index';
import '../../stylesheets/CourseView.css';


const parseCourses = ({ term, courses }) => {
	const parsedCourses = [];

	for (let subject in courses) {
		parsedCourses.push(...courses[subject].map(catalogNumber => ({
			subject,
			catalogNumber
		})));
	}

	return {
		term,
		courses: parsedCourses
	};
};


class MyCourseContainer extends Component {

	static propTypes = {
		username: PropTypes.string.isRequired,
		courseList: PropTypes.array.isRequired,
		cart: PropTypes.array.isRequired,
		updateCourseHandler: PropTypes.func.isRequired,
		reorderCartHandler: PropTypes.func.isRequired,
		text: PropTypes.string
	};

	static defaultProps = {
		text: ''
	};

	constructor(props) {
		super(props);

		this.state = {
			username: props.username,
			courseList: props.courseList,
			cart: props.cart
		};

		this.updateCourseHandler = props.updateCourseHandler;
		this.reorderCartHandler = props.reorderCartHandler;
		this.deselectCourseHandler = props.deselectCourseHandler;
	}

	componentWillReceiveProps(nextProps) {
		const { courseList, cart, username } = nextProps;
	  if (!arrayOfObjectEquals(courseList, this.state.courseList)) {
			this.setState({ courseList });
		}
		if (!arrayOfObjectEquals(cart, this.state.cart)) {
			this.setState({ cart });
		}
		if (username !== this.state.username) {
			this.setState({ username });
		}
	}

	render() {
		return (
			<div>
				<CourseBoard
					courseList={this.state.courseList}
					cart={this.state.cart}
					username={this.state.username}
					updateCourseHandler={this.updateCourseHandler}
					reorderCartHandler={this.reorderCartHandler}
					deselectCourseHandler={this.deselectCourseHandler}
				/>
			</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyCourseContainer));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { arrayOfObjectEquals } from '../../utils/arrays';
import CourseBoard from './CourseBoardContainer';
import { updateUserCourses } from '../../actions/index';
import '../../stylesheets/CourseView.css';


const parseCourses = ({ term, courses}) => {
	const parsedCourses = [];

	for (let subject in courses) {
		parsedCourses.push(...courses[subject].map(catalogNumber => ({
			subject,
			catalogNumber,
			id: uuidv4()
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
		text: PropTypes.string
	};

	static defaultProps = {
		text: ''
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: false,  //TODO: Change back to true
			error: false,
			courseList: props.courseList,
			cart: props.cart
		};

		this.updateCourseHandler = props.updateCourseHandler.bind(this, props.username);
		this.getCourses = this.getCourses.bind(this);
	}

	componentDidMount() {
	  // this.getCourses();
	}

	componentWillReceiveProps(nextProps) {
		const { courseList, cart } = nextProps;
	  if (!arrayOfObjectEquals(courseList, this.state.courseList)) {
			this.setState({ courseList });
		}
		if (!arrayOfObjectEquals(cart, this.state.cart)) {
			this.setState({ cart });
		}
	}

	getCourses() {
		return fetch('/parse/courses', {
			method: 'POST',
			body: JSON.stringify({
				text: this.props.text
			}),
			headers: {
	      'content-type': 'application/json'
	    }
		}).then(response => {
			if (!response.ok) {
				throw new Error(`status ${response.status}`);
			}
			return response.json();
		}).then((termCourse) => {
			this.setState({ loading: false });
			const courseList = [...this.state.courseList, parseCourses(termCourse)];
			this.updateCourseHandler(courseList);
		}).catch(err => this.setState({ loading: false, error: err.message }));
	}

	render() {
		const renderedView = (
			<div>
				<CourseBoard
					courseList={this.state.courseList}
					cart={this.state.cart}
					updateCourseHandler={this.updateCourseHandler}
					/>
			</div>
		);

		if (this.state.loading) {
			return <LoadingView />;
		} else if (this.state.error) {
			return (
				<ErrorView
					msgHeader={`Oops!  We encountered an error trying to fetch ${this.state.subject} ${this.state.catalogNumber}.`}
					msgBody={`Error message: ${this.state.error}`}
				/>
			);
		} else {
			return renderedView;
		}
	}

}

const mapStateToProps = ({ courseList, cart, user }) => {
	const { username } = user;
	return { courseList, cart, username };
};

const mapDispatchToProps = dispatch => {
	return {
		updateCourseHandler: (username, courseList) => {
			dispatch(updateUserCourses(username, courseList));
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyCourseContainer));

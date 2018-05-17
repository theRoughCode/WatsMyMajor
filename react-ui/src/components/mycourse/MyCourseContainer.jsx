import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { arrayOfObjectEquals } from '../../utils/arrays';
import CourseBoard from './CourseBoardContainer';
import { updateUserCourses } from '../../actions/index';
import '../../stylesheets/CourseView.css';


const getUserCourses = (userID) => {
	return {
		'1A': {
			term: 'F',
			year: '2016',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '135'
				},
				{
					subject: 'MATH',
					catalogNumber: '145'
				},
				{
					subject: 'PHYS',
					catalogNumber: '121'
				},
				{
					subject: 'MATH',
					catalogNumber: '137'
				},
				{
					subject: 'SPCOM',
					catalogNumber: '223'
				}
			]
		},
		'2A': {
			term: 'W',
			year: '2017',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '136'
				},
				{
					subject: 'MATH',
					catalogNumber: '146'
				},
				{
					subject: 'PHYS',
					catalogNumber: '122'
				},
				{
					subject: 'PHYS',
					catalogNumber: '124'
				},
				{
					subject: 'MATH',
					catalogNumber: '138'
				},
				{
					subject: 'ECON',
					catalogNumber: '101'
				}
			]
		},
		'2B': {
			term: 'S',
			year: '2017',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '246'
				},
				{
					subject: 'MATH',
					catalogNumber: '237'
				},
				{
					subject: 'CS',
					catalogNumber: '240E'
				},
				{
					subject: 'PHYS',
					catalogNumber: '234'
				},
				{
					subject: 'AMATH',
					catalogNumber: '250'
				},
				{
					subject: 'STAT',
					catalogNumber: '230'
				}
			]
		},
		'3A': {
			term: 'W',
			year: '2018',
			courses: [
				{
					subject: 'CS',
					catalogNumber: '240E'
				},
				{
					subject: 'CS',
					catalogNumber: '241'
				},
				{
					subject: 'CS',
					catalogNumber: '251'
				},
				{
					subject: 'MATH',
					catalogNumber: '239'
				},
				{
					subject: 'SPCOM',
					catalogNumber: '225'
				},
				{
					subject: 'STAT',
					catalogNumber: '231'
				}
			]
		},
		'3B': {
			term: '',
			year: '',
			courses: []
		}
	}
}


class MyCourseContainer extends Component {

	static propTypes = {
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
			loading: true,
			error: false,
			courseList: props.courseList,
			cart: props.cart
		};

		this.updateCourseHandler = props.updateCourseHandler;
		this.getCourses = this.getCourses.bind(this);
	}

	componentDidMount() {
	  this.getCourses();
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
			const courseList = [...this.state.courseList, termCourse];
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

const mapStateToProps = ({ courseList, cart }) => {
	return { courseList, cart };
};

const mapDispatchToProps = dispatch => {
	return {
		updateCourseHandler: courseList => {
			dispatch(updateUserCourses(courseList));
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyCourseContainer));

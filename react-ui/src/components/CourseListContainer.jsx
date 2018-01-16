import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import CourseContent from './courselist/CourseContent';
import CourseSideBar from './courselist/CourseSideBarContainer';
import LoadingView from './tools/LoadingView';
import ErrorView from './tools/ErrorView';
import '../stylesheets/CourseView.css';
import {
	setCourse,
	setExpandedCourse,
	createSnack,
	addToCart,
	removeFromCart
} from '../actions/index';


const getCourseData = (subject, catalogNumber) => {
	return fetch(`/wat/${subject}/${catalogNumber}`)
	.then(response => {
		if (!response.ok) {
			throw new Error(`status ${response.status}`);
		}
		return response.json();
	});
};

function updatePageInfo(subject, catalogNumber) {
	this.setState({ subject, catalogNumber });
	// fetch course data
	getCourseData(subject, catalogNumber)
	.then(json => {
		let {
			title,
			description,
			prereqs,
			antireqs,
			coreqs,
			crosslistings,
			terms,
			url,
			parPrereq,
			parCoreq,
			classList
		} = json;

		if (!Array.isArray(prereqs)) prereqs = prereqs.reqs;

		const course = {
			title,
			description,
			rating: 2.1,
			termsOffered: terms,
			antireqs,
			coreqs,
			prereqs,
			postreqs: parPrereq,
			term: (classList) ? classList.term : '',
			classes: (classList) ? classList.classes : []
		};

		this.setState({ loading: false, course });
	}).catch(error => {
		console.error(`ERROR: ${error}`);
		this.setState({ loading: false, error });
	});
};


class CourseListContainer extends Component {

	static propTypes = {
		subject: PropTypes.string,
		catalogNumber: PropTypes.string,
		instructor: PropTypes.string,
		attending: PropTypes.string,
		enrollmentCap: PropTypes.string,
		reserved: PropTypes.string,
		reservedCap: PropTypes.string,
		classNumber: PropTypes.string,
		lastUpdated: PropTypes.string,
		selectedClassIndex: PropTypes.number,
		selectCourseHandler: PropTypes.func.isRequired,
		expandCourseHandler: PropTypes.func.isRequired,
		addToCartHandler: PropTypes.func.isRequired
	};

	static defaultProps = {
		subject: 'CS',
		catalogNumber: '100',
		instructor: '',
		attending: '',
		enrollmentCap: '',
		reserved: '',
		reservedCap: '',
		classNumber: '',
		lastUpdated: '',
		selectedClassIndex: -1
	}

	constructor(props) {
		super(props);

		this.state = {
			subject: props.subject,
			catalogNumber: props.catalogNumber,
			loading: true,
			error: false,
			course: {
				title: '',
				rating: 0,
				termsOffered: [],
				description: '',
				antireqs: [],
				coreqs: [],
				prereqs: [],
				postreqs: [],
				term: '',
				classes: []
			},
			classInfo: {
				instructor: props.instructor,
				attending: props.attending,
				enrollmentCap: props.enrollmentCap,
				reserved: props.reserved,
				reservedCap: props.reservedCap,
				classNumber: props.classNumber,
				lastUpdated: props.lastUpdated
			}
		}

		this.selectedClassIndex = props.selectedClassIndex,
		this.selectCourseHandler = props.selectCourseHandler,
		this.expandCourseHandler = props.expandCourseHandler
		this.addToCartHandler = props.addToCartHandler
	}

	componentDidMount() {
		const { subject, catalogNumber } = this.props;

		if (subject && catalogNumber)
			updatePageInfo.call(this, subject, catalogNumber);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			const isNewCourse = (this.props.subject !== nextProps.subject || this.props.catalogNumber !== nextProps.catalogNumber);
			const isNewClass = (this.props.classNumber !== nextProps.classNumber);

			// User selected new course
			if (isNewCourse) {
				const { subject, catalogNumber } = nextProps;
				this.setState({ loading: true });
				updatePageInfo.call(this, subject, catalogNumber);
			}

			// User selected new class
			if (isNewClass) {
				const {
					instructor,
					attending,
					enrollmentCap,
					reserved,
					reservedCap,
					classNumber,
					lastUpdated,
					selectedClassIndex
				} = nextProps;

				const classInfo = {
					instructor,
					attending,
					enrollmentCap,
					reserved,
					reservedCap,
					classNumber,
					lastUpdated,
				};

				this.setState({ classInfo, selectedClassIndex });
			}
		}
	}

	render() {
		const renderedView = (
			<div className="course-view">
				<CourseContent
					selectedClassIndex={this.selectedClassIndex}
					selectCourseHandler={this.selectCourseHandler}
					expandCourseHandler={this.expandCourseHandler}
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					{...this.state.course}
					/>
				<CourseSideBar
					{...this.state.classInfo}
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					addToCartHandler={this.addToCartHandler.bind(this, this.state.subject, this.state.catalogNumber)}
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

const mapStateToProps = ({ course, expandedCourse }) => {
	const { subject, catalogNumber } = course;
	const {
		instructor,
		attending,
		enrollmentCap,
		reserved,
		reservedCap,
		classNumber,
		lastUpdated,
		selectedClassIndex
	} = expandedCourse;

	return {
		subject,
		catalogNumber,
		instructor,
		attending,
		enrollmentCap,
		reserved,
		reservedCap,
		classNumber,
		lastUpdated,
		selectedClassIndex
	};
};

const mapDispatchToProps = dispatch => {
	return {
		selectCourseHandler: (subject, catalogNumber) => {
			dispatch(setCourse(subject, catalogNumber));
		},
		expandCourseHandler: (courseObj, index) => {
			dispatch(setExpandedCourse(courseObj, index));
		},
		addToCartHandler: (subject, catalogNumber) => {
			const msg = `${subject}${catalogNumber} has been added to your cart.`;
			const actionMsg = 'undo';
			const undoMsg = `${subject}${catalogNumber} has been removed from your cart.`;
			const id = uuidv4();
			const handleActionClick = () => dispatch(removeFromCart(id));
			dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
			dispatch(addToCart(subject, catalogNumber, id));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseListContainer);

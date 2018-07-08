import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import CourseContent from './CourseContent';
import CourseSideBar from './CourseSideBarContainer';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { objectEquals, arrayOfObjectEquals } from '../../utils/arrays';
import { hasTakenCourse, isInCart, canTakeCourse } from '../../utils/courses';
import '../../stylesheets/CourseView.css';
import {
	setExpandedCourse,
	createSnack,
	addToCart,
	removeFromCart
} from '../../actions/index';


const getCourseData = (subject, catalogNumber) => {
	return fetch(`/wat/${subject}/${catalogNumber}`)
	.then(response => {
		if (!response.ok) {
			throw new Error(`status ${response.status}`);
		}
		return response.json();
	});
};

class CourseListContainer extends Component {

	static propTypes = {
		username: PropTypes.string.isRequired,
		cart: PropTypes.array.isRequired,
		instructor: PropTypes.string,
		attending: PropTypes.string,
		enrollmentCap: PropTypes.string,
		reserved: PropTypes.string,
		reservedCap: PropTypes.string,
		classNumber: PropTypes.string,
		lastUpdated: PropTypes.string,
		selectedClassIndex: PropTypes.number,
		expandCourseHandler: PropTypes.func.isRequired,
		addToCartHandler: PropTypes.func.isRequired,
		removeFromCartHandler: PropTypes.func.isRequired
	};

	static defaultProps = {
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

		const { subject, catalogNumber } = props.match.params;

		this.state = {
			subject,
			catalogNumber,
			loading: true,
			error: false,
			taken: hasTakenCourse(subject, catalogNumber, props.myCourses),
			inCart: isInCart(subject, catalogNumber, props.cart),
			eligible: false,
			course: {
				title: '',
				rating: 0,
				termsOffered: [],
				description: '',
				antireqs: [],
				coreqs: [],
				prereqs: {},
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
			},
		}

		this.selectedClassIndex = props.selectedClassIndex;
		this.expandCourseHandler = props.expandCourseHandler;
		this.updatePageInfo = this.updatePageInfo.bind(this);
		this.selectCourse = this.selectCourse.bind(this);
		this.addCourseToCart = this.addCourseToCart.bind(this);
		this.removeCourseFromCart = this.removeCourseFromCart.bind(this);
	}

	componentDidMount() {
		const { subject, catalogNumber } = this.state;
		this.updatePageInfo(subject, catalogNumber);
	}

	componentWillReceiveProps(nextProps) {
		const { subject, catalogNumber } = this.props.match.params;
		const nextSubject = nextProps.match.params.subject;
		const nextCatNum = nextProps.match.params.catalogNumber;
		const updatedCart = !arrayOfObjectEquals(nextProps.cart, this.props.cart);
		const updatedCourseList = !objectEquals(nextProps.myCourses, this.props.myCourses);
		const isNewCourse = (subject !== nextSubject || catalogNumber !== nextCatNum);
		const isNewClass = (this.props.classNumber !== nextProps.classNumber);

		if (isNewClass || isNewCourse || updatedCart || updatedCourseList) {
			// User selected new course
			if (isNewCourse || updatedCourseList) {
				const { myCourses } = nextProps;
				const taken = hasTakenCourse(nextSubject, nextCatNum, myCourses);
				this.setState({ loading: true, taken });
				this.updatePageInfo(nextSubject, nextCatNum);
			}

			if (isNewCourse || updatedCart) {
				const { cart } = nextProps;
				const inCart = isInCart(nextSubject, nextCatNum, cart);
				this.setState({ inCart });
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
					selectedClassIndex,
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

	updatePageInfo(subject, catalogNumber) {
		if (!subject || !catalogNumber) return;
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

			const eligible = canTakeCourse(this.props.myCourses, prereqs, coreqs, antireqs);

			this.setState({ loading: false, course, subject, catalogNumber, eligible });
		}).catch(error => {
			console.error(`ERROR: ${error}`);
			this.setState({ loading: false, error, subject, catalogNumber });
		});
	};

	selectCourse(subject, catalogNumber) {
		this.props.history.push(`/courses/${subject}/${catalogNumber}`);
	}

	addCourseToCart(subject, catalogNumber) {
		const { addToCartHandler, username, cart } = this.props;
		const { taken } = this.state;
		addToCartHandler(username, cart, subject, catalogNumber, taken);
	}

	removeCourseFromCart(subject, catalogNumber) {
		const { removeFromCartHandler, username, cart } = this.props;
		removeFromCartHandler(username, cart, subject, catalogNumber);
	}

	render() {
		const renderedView = (
			<div className="course-view">
				<CourseContent
					selectedClassIndex={this.selectedClassIndex}
					selectCourse={this.selectCourse}
					expandCourse={this.expandCourseHandler}
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					taken={this.state.taken}
					inCart={this.state.inCart}
					eligible={this.state.eligible}
					addToCartHandler={this.addCourseToCart}
					removeFromCartHandler={this.removeCourseFromCart}
					{...this.state.course}
				/>
				<CourseSideBar
					{...this.state.classInfo}
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					isVisible={this.state.classInfo.classNumber.length > 0}
				/>
			</div>
		);

		if (this.state.loading) {
			return <LoadingView />;
		} else if (this.state.error) {
			return (
				<ErrorView
					msgHeader={"Oops!"}
					msgBody={`${this.state.subject} ${this.state.catalogNumber} is not a valid course!`}
				/>
			);
		} else {
			return renderedView;
		}
	}

}

const mapStateToProps = ({ expandedCourse, myCourses, cart, user }) => {
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
		instructor,
		attending,
		enrollmentCap,
		reserved,
		reservedCap,
		classNumber,
		lastUpdated,
		selectedClassIndex,
		myCourses,
		cart,
		username: user.username
	};
};

const mapDispatchToProps = dispatch => {
	return {
		expandCourseHandler: (courseObj, index) => {
			dispatch(setExpandedCourse(courseObj, index));
		},
		addToCartHandler: (username, cart, subject, catalogNumber, hasTaken) => {
			if (hasTaken) {
				const msg = `${subject} ${catalogNumber} is already in your courses.`;
				dispatch(createSnack(msg));
			} else {
				const msg = `${subject} ${catalogNumber} has been added to your cart.`;
				const actionMsg = 'undo';
				const undoMsg = `${subject} ${catalogNumber} has been removed from your cart.`;
				const handleActionClick = () => dispatch(removeFromCart(subject, catalogNumber));
				dispatch(addToCart(subject, catalogNumber, username, cart));
				dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
			}
		},
		removeFromCartHandler: (username, cart, subject, catalogNumber) => {
			const msg = `${subject} ${catalogNumber} has been removed from your cart.`;
			const actionMsg = 'undo';
			const undoMsg = `${subject} ${catalogNumber} has been re-added to your cart.`;
			const handleActionClick = () => dispatch(addToCart(subject, catalogNumber));
			dispatch(removeFromCart(subject, catalogNumber, username, cart));
			dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseListContainer));

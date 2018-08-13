import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import CourseContent from './content/CourseContent';
import ClassDetails from './classes/ClassDetailsContainer';
import PrereqsTree from './tree/PrerequisitesTreeContainer';
import LoadingView from '../tools/LoadingView';
import ErrorView from '../tools/ErrorView';
import { objectEquals, arrayOfObjectEquals } from '../../utils/arrays';
import { hasTakenCourse, isInCart, canTakeCourse } from '../../utils/courses';
import { createSnack, addToCart, removeFromCart } from '../../actions';
import '../../stylesheets/CourseView.css';

const styles = {
	courseView: {
		width: '100%',
	  display: 'flex',
	}
};

const defaultCourse = {
	title: '',
	description: '',
	rating: 0,
	url: '',
	termsOffered: [],
	crosslistings: '',
	antireqs: [],
	coreqs: [],
	prereqs: {},
	postreqs: [],
	term: '',
	classes: []
};

const defaultClassInfo = {
	units: 0,
	note: '',
	classNumber: 0,
	section: '',
	campus: '',
	enrollmentCap: 0,
	enrollmentTotal: 0,
	waitingCap: 0,
	waitingTotal: 0,
	reserveCap: 0,
	reserveTotal: 0,
	reserveGroup: '',
	startTime: '',
	endTime: '',
	weekdays: [],
	isTBA: false,
	isCancelled: false,
	isClosed: false,
	instructor: '',
	location: '',
	lastUpdated: ''
};

const getCourseData = (subject, catalogNumber) => {
	return fetch(`/server/wat/${subject}/${catalogNumber}`, {
		headers: {
			'x-secret': process.env.REACT_APP_SERVER_SECRET
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`status ${response.status}`);
		}
		return response.json();
	});
};

class CourseViewContainer extends Component {

	static propTypes = {
		myCourses: PropTypes.object.isRequired,
		cart: PropTypes.array.isRequired,
		username: PropTypes.string.isRequired,
		addToCartHandler: PropTypes.func.isRequired,
		removeFromCartHandler: PropTypes.func.isRequired,
		match: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		const { subject, catalogNumber } = props.match.params;

		this.state = {
			subject,
			catalogNumber,
			loading: true,
			error: false,
			sideBarOpen: false,
			taken: hasTakenCourse(subject, catalogNumber, props.myCourses),
			inCart: isInCart(subject, catalogNumber, props.cart),
			eligible: false,
			course: defaultCourse,
			classInfo: defaultClassInfo,
		}

		this.onExpandClass = this.onExpandClass.bind(this);
		this.closeSideBar = this.closeSideBar.bind(this);
		this.updatePageInfo = this.updatePageInfo.bind(this);
		this.viewCart = this.viewCart.bind(this);
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
		const updatedUserCourses = !objectEquals(nextProps.myCourses, this.props.myCourses);
		const isNewCourse = (subject !== nextSubject || catalogNumber !== nextCatNum);

		if (isNewCourse || updatedCart || updatedUserCourses) {
			// Don't want class info from previous class
			if (isNewCourse) this.closeSideBar();

			// User selected new course
			if (isNewCourse || updatedUserCourses) {
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
		}
	}

	async updatePageInfo(subject, catalogNumber) {
		if (!subject || !catalogNumber) return;

		try {
			// fetch course data
			const json = await getCourseData(subject, catalogNumber);
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

			// Update page title
			document.title = `${subject} ${catalogNumber} - ${title} :: WatsMyMajor`;

			const course = {
				title,
				description,
				rating: 2.1,
				url,
				termsOffered: terms,
				crosslistings,
				antireqs,
				coreqs,
				prereqs,
				postreqs: parPrereq,
				term: (classList) ? classList.term : '',
				classes: (classList) ? classList.classes : []
			};

			const eligible = canTakeCourse(this.props.myCourses, prereqs, coreqs, antireqs);

			this.setState({ loading: false, course, subject, catalogNumber, eligible });
		} catch(error) {
			console.error(`ERROR: ${error}`);
			this.setState({ loading: false, error, subject, catalogNumber });
		};
	};

	viewCart() {
		this.props.history.push('/my-courses');
	}

	addCourseToCart(subject, catalogNumber) {
		const { addToCartHandler, username, cart } = this.props;
		const { taken } = this.state;
		addToCartHandler(username, cart, subject, catalogNumber, taken, this.viewCart);
	}

	removeCourseFromCart(subject, catalogNumber) {
		const { removeFromCartHandler, username, cart } = this.props;
		removeFromCartHandler(username, cart, subject, catalogNumber);
	}

	onExpandClass(classInfo) {
		this.setState({ sideBarOpen: true, classInfo });
	}

	closeSideBar() {
		this.setState({ sideBarOpen: false, classInfo: defaultClassInfo });
	}

	render() {
		const {
			subject,
			catalogNumber,
			course,
			taken,
			inCart,
			eligible,
			classInfo,
			sideBarOpen,
			loading,
			error
		} = this.state;

		const renderedCourseView = (
			<div style={ styles.courseView }>
				<CourseContent
					subject={ subject }
					catalogNumber={ catalogNumber }
					course={ course }
					expandClass={ this.onExpandClass }
					taken={ taken }
					inCart={ inCart }
					eligible={ eligible }
					addToCartHandler={ this.addCourseToCart }
					removeFromCartHandler={ this.removeCourseFromCart }
				/>
				<ClassDetails
					classInfo={ classInfo }
					open={ sideBarOpen }
					onClose={ this.closeSideBar }
				/>
			</div>
		);

		const courseView = (loading)
			? <LoadingView />
			: (error)
				? (
					<ErrorView
						msgHeader={"Oops!"}
						msgBody={`${subject} ${catalogNumber} is not a valid course!`}
					/>
				)
				: renderedCourseView;

		const prereqsTree = <PrereqsTree subject={ subject } catalogNumber={ catalogNumber } />;

		return (
      <div style={{ width: '100%', height: '100%' }}>
        <Route
          path={ `${this.props.match.path}` }
          exact
          render={ () => courseView }
        />
        <Route
          path={ `${this.props.match.path}/tree/prereqs` }
          render={ () => prereqsTree }
        />
      </div>
    );
	}

}

const mapStateToProps = ({ myCourses, cart, user }) => ({
	myCourses,
	cart,
	username: user.username
});

const mapDispatchToProps = dispatch => {
	return {
		addToCartHandler: (username, cart, subject, catalogNumber, hasTaken, viewCartHandler) => {
			if (hasTaken) {
				const msg = `${subject} ${catalogNumber} is already in your courses.`;
				dispatch(createSnack(msg));
			} else {
				const msg = `${subject} ${catalogNumber} has been added to your cart.`;
				const actionMsg = 'View Cart';
				dispatch(addToCart(subject, catalogNumber, username, cart));
				dispatch(createSnack(msg, actionMsg, null, viewCartHandler));
			}
		},
		removeFromCartHandler: (username, cart, subject, catalogNumber) => {
			const msg = `${subject} ${catalogNumber} has been removed from your cart.`;
			const actionMsg = 'undo';
			const undoMsg = `${subject} ${catalogNumber} has been re-added to your cart.`;
			const handleActionClick = () => dispatch(addToCart(subject, catalogNumber, username, cart));
			dispatch(removeFromCart(subject, catalogNumber, username, cart));
			dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
		}
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseViewContainer));

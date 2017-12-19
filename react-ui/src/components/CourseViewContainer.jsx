import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import CourseContent from './courseview/CourseContent';
import CourseSideBar from './courseview/CourseSideBarContainer';
import { setCourse, setExpandedCourse } from '../actions/index';


const styles = {
	loading: {
		margin: 'auto',
		padding: '200px 0'
	}
};

const getCourseData = (subject, catalogNumber) => {
	return fetch(`/wat/${subject}/${catalogNumber}`)
	.then(response => {
		if (!response.ok) {
			throw new Error(`status ${response.status}`);
		}
		return response.json();
	});
};


class CourseViewContainer extends Component {

	static propTypes = {
		subject: PropTypes.string,
		catalogNumber: PropTypes.string,
		instructor: PropTypes.string,
		attending: PropTypes.string,
		enrollmentCap: PropTypes.string,
		classNumber: PropTypes.string,
		selectedClassIndex: PropTypes.number,
		selectCourseHandler: PropTypes.func.isRequired,
		expandCourseHandler: PropTypes.func.isRequired
	};

	static defaultProps = {
		subject: 'CS',
		catalogNumber: '100',
		instructor: '',
		attending: '',
		enrollmentCap: '',
		classNumber: '',
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
				classNumber: props.classNumber
			},
			selectedClassIndex: props.selectedClassIndex,
			selectCourseHandler: props.selectCourseHandler,
			expandCourseHandler: props.expandCourseHandler
		}
	}

	componentDidMount() {
		const { subject, catalogNumber } = this.props;

		if (subject && catalogNumber) {
			this.setState({ subject, catalogNumber });
			// fetch course data
			getCourseData(subject, catalogNumber)
			.then(json => {
				const {
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

				console.log('json', json);

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
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			const isNewCourse = (this.props.subject !== nextProps.subject || this.props.catalogNumber !== nextProps.catalogNumber);
			const isNewClass = (this.props.classNumber !== nextProps.classNumber);

			// User selected new course
			if (isNewCourse) {
				const { subject, catalogNumber } = nextProps;
				this.setState({ subject, catalogNumber, loading: true });

				// fetch course data
				getCourseData(subject, catalogNumber)
				.then(json => {
					const {
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

					console.log('json', json);

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
			}

			// User selected new class
			if (isNewClass) {
				const {
					instructor,
					attending,
					enrollmentCap,
					classNumber,
					selectedClassIndex
				} = nextProps;

				const classInfo = {
					instructor,
					attending,
					enrollmentCap,
					classNumber
				};

				this.setState({ classInfo, selectedClassIndex });
			}
		}
	}

	render() {
		const loadingView = (
			<div className="loading course-view">
				<CircularProgress
					size={80}
					thickness={5}
					style={styles.loading}
					/>
			</div>
		);

		const errorView = (
			<div className="error-wrapper course-view">
				<span>{`Oops!  We encountered an error trying to fetch ${this.state.subject} ${this.state.catalogNumber}.`}</span>
				<span>{`Error message: ${this.state.error}`}</span>
			</div>
		)

		const renderedView = (
			<div className="course-view">
				<CourseContent
					selectedClassIndex={this.state.selectedClassIndex}
					selectCourseHandler={this.state.selectCourseHandler}
					expandCourseHandler={this.state.expandCourseHandler}
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					{...this.state.course}
					/>
				<CourseSideBar
					{...this.state.classInfo}
					/>
			</div>
		);

		if (this.state.loading) {
			return loadingView;
		} else if (this.state.error) {
			return errorView;
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
		classNumber,
		selectedClassIndex
	} = expandedCourse;

	return {
		subject,
		catalogNumber,
		instructor,
		attending,
		enrollmentCap,
		classNumber,
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseViewContainer);

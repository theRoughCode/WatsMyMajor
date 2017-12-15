import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import CourseContent from './courseview/CourseContent';
import CourseSideBar from './courseview/CourseSideBarContainer';
import { setCourse, setExpandedCourse } from '../actions/index';


const styles = {
	loading: {
		margin: 'auto'
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
			loading: true,
			error: false,
			subject: props.subject,
			catalogNumber: props.catalogNumber,
			instructor: props.instructor,
			attending: props.attending,
			enrollmentCap: props.enrollmentCap,
			classNumber: props.classNumber,
			selectedClassIndex: props.selectedClassIndex,
			selectCourseHandler: props.selectCourseHandler,
			expandCourseHandler: props.expandCourseHandler,
			title: '',
			rating: 0,
			termsOffered: [],
			description: '',
			antireqs: [],
			coreqs: [],
			prereqs: [],
			postreqs: []
		}
	}

	componentDidMount() {
		const { subject, catalogNumber } = this.props;

		if (subject && catalogNumber) {
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
						parCoreq
					} = json;

					console.log('json', json);

					this.setState({
						loading: false,
						title,
						description,
						rating: 2.1,
						termsOffered: terms,
						antireqs,
						coreqs,
						prereqs,
						postreqs: parPrereq
					});
				}).catch(error => {
					console.error(`ERROR: ${error}`);
					this.setState({ loading: false, error });
					return;
				});
		} else {
			this.setState({
				loading: false,
				title: 'Introduction to Data Abstraction and Implementation',
				description: 'Software abstractions via elementary data structures and their implementation; encapsulation and modularity; class and interface definitions; object instantiation; recursion; elementary abstract data types, including sequences, stacks, queues, and trees; implementation using linked structures and arrays; vectors and strings; memory models; automatic vs. dynamic memory management.',
				rating: 3.5,
				termsOffered: ['F', 'W'],
				antireqs: ['CS 234', 'CS 235'],
				coreqs: ['CS 222', 'CS 232'],
				prereqs: ['CS 137', 'CS 138'],
				postreqs: ['CS 371', 'CS 472']
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			this.setState({ ...nextProps, loading: true });

			const { subject, catalogNumber } = nextProps;
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
					parCoreq
				} = json;

				console.log('json', json);

				this.setState({
					loading: false,
					title,
					description,
					rating: 2.1,
					termsOffered: terms,
					antireqs,
					coreqs,
					prereqs,
					postreqs: parPrereq
				});
			}).catch(error => {
				console.error(`ERROR: ${error}`);
				this.setState({ loading: false, error });
				return;
			});
		}
	}

	render() {
		const loadingView = (
			<div className="loading">
				<CircularProgress
					size={80}
					thickness={5}
					style={styles.loading}
					/>
			</div>
		);

		const errorView = (
			<div className="error-wrapper">
				<span>{`Oops!  We encountered an error trying to fetch ${this.state.subject} ${this.state.catalogNumber}.`}</span>
				<span>{`Error message: ${this.state.error}`}</span>
			</div>
		)

		const renderedView = (
			<div className="course-view">
				<CourseContent
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					selectedClassIndex={this.state.selectedClassIndex}
					selectCourseHandler={this.state.selectCourseHandler}
					expandCourseHandler={this.state.expandCourseHandler}
					title={this.state.title}
					rating={this.state.rating}
					termsOffered={this.state.termsOffered}
					description={this.state.description}
					antireqs={this.state.antireqs}
					coreqs={this.state.coreqs}
					prereqs={this.state.prereqs}
					postreqs={this.state.postreqs}
					/>
				<CourseSideBar
					instructor={this.state.instructor}
					attending={this.state.attending}
					enrollmentCap={this.state.enrollmentCap}
					classNumber={this.state.classNumber}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CourseContent from './courseview/CourseContent';
import CourseSideBar from './courseview/CourseSideBarContainer';
import { setCourse } from '../actions/index';


class CourseViewContainer extends Component {

	static propTypes = {
		subject: PropTypes.string,
		catalogNumber: PropTypes.string
	};

	static defaultProps = {
		subject: 'CS',
		catalogNumber: '100'
	}

	constructor(props) {
		super(props);

		this.state = {
			subject: props.subject,
			catalogNumber: props.catalogNumber,
      selectCourseHandler:props.selectCourseHandler,
			content: {
				title: '',
        rating: 0,
				offered: [],
        description: '',
				antireqs: [],
				prereqs: [],
				postreqs: []
			}
		}
	}

	componentDidMount() {
		this.setState({
			content: {
				title: 'Introduction to Data Abstraction and Implementation',
				description: 'Software abstractions via elementary data structures and their implementation; encapsulation and modularity; class and interface definitions; object instantiation; recursion; elementary abstract data types, including sequences, stacks, queues, and trees; implementation using linked structures and arrays; vectors and strings; memory models; automatic vs. dynamic memory management.',
        rating: 3.5,
				offered: ['F', 'W'],
				antireqs: ['CS 234', 'CS 235'],
				prereqs: ['CS 137', 'CS 138'],
				postreqs: ['CS 371', 'CS 472']
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			this.setState(nextProps);
		}
	}

	render() {
		return (
			<div className="course-view">
				<CourseContent
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
          selectCourseHandler={this.state.selectCourseHandler}
					{...this.state.content}
					/>
				<CourseSideBar />
			</div>
		);
	}

}

const mapStateToProps = ({ course }) => {
	const { subject, catalogNumber } = course;
	return {
		subject,
		catalogNumber
	};
};

const mapDispatchToProps = dispatch => {
  return {
    selectCourseHandler: (subject, catalogNumber) => {
      dispatch(setCourse(subject, catalogNumber));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseViewContainer);

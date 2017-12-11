import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import CourseContent from './courseview/CourseContent'
import CourseSideBar from './courseview/CourseSideBar'


class CourseView extends Component {

	static propTypes = {
		subject: PropTypes.string,
		catalogNumber: PropTypes.string
	};

	static defaultProps = {
		subject: '',
		catalogNumber: ''
	}

	render() {
		return (
			<div className="course-view">
				<CourseContent
					subject={this.props.subject}
					catalogNumber={this.props.catalogNumber}
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
	}

};

export default connect(mapStateToProps, null)(CourseView);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseContent from './courseview/CourseContent'
import CourseSideBar from './courseview/CourseSideBar'


export default class CourseView extends Component {

	static propTypes = {
		course: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);

		const [ subject, catalogNumber ] = props.course.split(' ');

		this.state = {
			subject: subject || 'CS',
			catalogNumber: catalogNumber || '240'
		};
	}

	componentWillReceiveProps(nextProps) {
		const [ subject, catalogNumber ] = nextProps.course.split(' ');
		this.setState({
			subject,
			catalogNumber
		})
	}

	render() {
		return (
			<div className="course-view">
				<CourseContent
					subject={this.state.subject}
					catalogNumber={this.state.catalogNumber}
					/>
				<CourseSideBar />
			</div>
		);
	}

}

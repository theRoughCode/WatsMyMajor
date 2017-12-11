import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseHeader from './content/CourseHeader';

const CourseContent = (props) => {
	const {
		subject,
		catalogNumber,
		title,
		description,
		offered,
		antireqs,
		prereqs,
		proreqs
	} = props;

	return (
		<div className="course-content">
			<CourseHeader
				subject={subject}
				catalogNumber={catalogNumber}
				title={title}
				offered={offered}
				/>
		</div>
	);
};

CourseContent.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	offered: PropTypes.array.isRequired,
	antireqs: PropTypes.array.isRequired,
	prereqs: PropTypes.array.isRequired,
	proreqs: PropTypes.array.isRequired
}

export default CourseContent;

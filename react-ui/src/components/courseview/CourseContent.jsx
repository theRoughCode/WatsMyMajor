import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseHeader from './content/CourseHeader';
import CourseDescription from './content/CourseDescription';
import CourseClassList from './content/CourseClassList';

const CourseContent = (props) => {
	const {
		subject,
		catalogNumber,
		title,
		rating,
		offered,
		description,
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
				rating={rating}
				offered={offered}
				/>
			<CourseDescription
				description={description}
				antireqs={antireqs}
				prereqs={prereqs}
				proreqs={proreqs}
				/>
			<CourseClassList
				classList={[
					{
						section: 'LEC 001',
						class: '8304',
						campus: 'UW U',
						enrollmentCap: '60',
						attending: '34',
						startTime: '8.30',
						endTime: '9.50',
						days: [2, 4],
						location: 'MC 4042',
						instructor: 'Firas Mansour'
					}
				]}
				/>
		</div>
	);
};

CourseContent.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	offered: PropTypes.array.isRequired,
	antireqs: PropTypes.array.isRequired,
	prereqs: PropTypes.array.isRequired,
	proreqs: PropTypes.array.isRequired
}

export default CourseContent;

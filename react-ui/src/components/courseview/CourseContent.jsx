import React from 'react';
import PropTypes from 'prop-types';
import CourseHeader from './content/CourseHeader';
import CourseDescription from './content/CourseDescription';
import CourseClassList from './content/CourseClassList';

const CourseContent = (props) => {
	const {
		subject,
		catalogNumber,
		selectedClassIndex,
		selectCourseHandler,
		expandCourseHandler,
		title,
		rating,
		termsOffered,
		description,
		antireqs,
    coreqs,
		prereqs,
		postreqs
	} = props;

	return (
		<div className="course-content">
			<CourseHeader
				subject={subject}
				catalogNumber={catalogNumber}
				title={title}
				rating={rating}
				termsOffered={termsOffered}
				/>
			<CourseDescription
				description={description}
        antireqs={antireqs}
				coreqs={coreqs}
				prereqs={prereqs}
				postreqs={postreqs}
				selectCourseHandler={selectCourseHandler}
				/>
			<CourseClassList
				expandCourseHandler={expandCourseHandler}
				selectedClassIndex={selectedClassIndex}
				classList={[
					{
						section: 'LEC 001',
						classNumber: '8304',
						campus: 'UW U',
						enrollmentCap: '60',
						attending: '34',
						startTime: '8.30',
						endTime: '9.50',
						days: [2, 4],
						location: 'MC 4042',
						instructor: 'Firas Mansour'
					},
					{
						section: 'LEC 002',
						classNumber: '8305',
						campus: 'UW U',
						enrollmentCap: '60',
						attending: '50',
						startTime: '10.30',
						endTime: '11.50',
						days: [1, 3, 5],
						location: 'MC 4045',
						instructor: 'Stephen New'
					}
				]}
				/>
		</div>
	);
};

CourseContent.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	selectedClassIndex: PropTypes.number.isRequired,
	selectCourseHandler: PropTypes.func.isRequired,
	expandCourseHandler: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	termsOffered: PropTypes.array.isRequired,
	antireqs: PropTypes.array.isRequired,
  coreqs: PropTypes.array.isRequired,
	prereqs: PropTypes.array.isRequired,
	postreqs: PropTypes.array.isRequired
}

export default CourseContent;

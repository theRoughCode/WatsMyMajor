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
		postreqs,
		term,
		classes
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
			{
				classes.length > 0 && (
					<CourseClassList
						expandCourseHandler={expandCourseHandler}
						selectedClassIndex={selectedClassIndex}
						term={term}
						classes={classes}
						/>
				)
			}
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
	prereqs: PropTypes.object.isRequired,
	postreqs: PropTypes.array.isRequired,
	term: PropTypes.string.isRequired,
	classes: PropTypes.array.isRequired
}

export default CourseContent;

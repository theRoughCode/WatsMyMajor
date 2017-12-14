import React from 'react';
import PropTypes from 'prop-types';
import CourseRequisites from './CourseRequisites';


const CourseDescription = (props) => {
	const {
    description,
		antireqs,
		prereqs,
		postreqs,
    selectCourseHandler
	} = props;

	return (
		<div className="course-description">
      <p className="description">
        {description}
      </p>
      <CourseRequisites
        antireqs={antireqs}
        prereqs={prereqs}
        postreqs={postreqs}
        selectCourseHandler={selectCourseHandler}
        />
		</div>
	);
};

CourseDescription.propTypes = {
  description: PropTypes.string.isRequired,
  antireqs: PropTypes.array.isRequired,
  prereqs: PropTypes.array.isRequired,
  postreqs: PropTypes.array.isRequired,
  selectCourseHandler: PropTypes.func.isRequired
};

export default CourseDescription;

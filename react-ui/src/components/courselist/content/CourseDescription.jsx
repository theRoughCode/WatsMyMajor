import React from 'react';
import PropTypes from 'prop-types';
import CourseRequisites from './CourseRequisites';


const CourseDescription = (props) => {
	const {
    description,
		antireqs,
    coreqs,
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
        coreqs={coreqs}
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
  coreqs: PropTypes.array.isRequired,
  prereqs: PropTypes.array.isRequired,
  postreqs: PropTypes.array.isRequired,
  selectCourseHandler: PropTypes.func.isRequired
};

export default CourseDescription;

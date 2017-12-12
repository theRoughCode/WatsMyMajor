import React from 'react';
import PropTypes from 'prop-types';
import CourseRequisites from './CourseRequisites';


const CourseDescription = (props) => {
	const {
    description,
		antireqs,
		prereqs,
		proreqs
	} = props;

	return (
		<div className="course-description">
      <p className="description">
        {description}
      </p>
      <CourseRequisites
        antireqs={antireqs}
        prereqs={prereqs}
        proreqs={proreqs}
        />
		</div>
	);
};

CourseDescription.propTypes = {
  description: PropTypes.string.isRequired,
  antireqs: PropTypes.array.isRequired,
  prereqs: PropTypes.array.isRequired,
  proreqs: PropTypes.array.isRequired
};

export default CourseDescription;

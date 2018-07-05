import React from 'react';
import PropTypes from 'prop-types';
import CourseRequisites from './CourseRequisites';

const CourseDescription = ({
	description,
	antireqs,
	coreqs,
	prereqs,
	postreqs,
	selectCourse
}) => (
	<div className="course-description">
		<p className="description">
			{description}
		</p>
		<CourseRequisites
			antireqs={antireqs}
			coreqs={coreqs}
			prereqs={prereqs}
			postreqs={postreqs}
			selectCourse={selectCourse}
		/>
	</div>
);

CourseDescription.propTypes = {
  description: PropTypes.string.isRequired,
  antireqs: PropTypes.array.isRequired,
  coreqs: PropTypes.array.isRequired,
  prereqs: PropTypes.object.isRequired,
  postreqs: PropTypes.array.isRequired,
  selectCourse: PropTypes.func.isRequired
};

export default CourseDescription;

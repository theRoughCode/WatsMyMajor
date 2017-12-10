import React from 'react';
import PropTypes from 'prop-types';

const CourseSideBar = ({ subject, catalogNumber }) => (
	<div className="course-content">
		{`Subject: ${subject}  Catalog number: ${catalogNumber}`}
	</div>
);

CourseSideBar.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired
}

export default CourseSideBar;

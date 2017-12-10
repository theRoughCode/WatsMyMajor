import React from 'react';
import PropTypes from 'prop-types';
import CourseInfo from './CourseInfo';
import CourseProf from './CourseProf';

const style = {
  height: 'auto',
  width: 270,
  margin: 20,
  marginRight: 0,
  display: 'inline-block',
};

const CourseSideBar = () => (
	<div className="course-side-bar">
		<CourseInfo style={style} />
		<CourseProf style={style} />
	</div>
);

export default CourseSideBar;

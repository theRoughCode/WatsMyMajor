import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CourseHeader = (props) => {
	const {
		subject,
		catalogNumber,
		title,
		offered
	} = props;

	return (
		<div>{`Subject: ${subject}  Catalog number: ${catalogNumber}`}</div>
	);
};

CourseHeader.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	offered: PropTypes.array.isRequired
};

export default CourseHeader;

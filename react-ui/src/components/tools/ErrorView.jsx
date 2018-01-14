import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = {
	margin: 'auto',
	padding: '200px 0'
};

const ErrorView = ({ msgHeader, msgBody }) => (
	<div className="error-wrapper course-view">
		<span>{msgHeader}</span>
		<span>{msgBody}</span>
	</div>
);

ErrorView.propTypes = {
	msgHeader: PropTypes.string,
	msgBody: PropTypes.string
};

ErrorView.defaultProps = {
	msgHeader: 'ERROR!!',
	msgBody: ''
};

export default ErrorView;

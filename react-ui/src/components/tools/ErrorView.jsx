import React from 'react';
import PropTypes from 'prop-types';

const ErrorView = ({ msgHeader, msgBody }) => (
  <div className="error-wrapper course-view">
    <h1>{msgHeader}</h1>
    <span>{msgBody}</span>
  </div>
);

ErrorView.propTypes = {
  msgHeader: PropTypes.string,
  msgBody: PropTypes.string,
};

ErrorView.defaultProps = {
  msgHeader: 'ERROR!!',
  msgBody: '',
};

export default ErrorView;

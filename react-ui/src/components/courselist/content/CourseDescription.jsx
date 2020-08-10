import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    padding: '0 10px',
  },
  description: {
    fontSize: 15,
    margin: 'auto',
    marginBottom: 10,
    textAlign: 'left',
    lineHeight: 1.5,
    color: '#5c6e84',
  },
};

const CourseDescription = ({
  subject,
  catalogNumber,
  description,
  crosslistings,
  antireqs,
  coreqs,
  prereqs,
  postreqs,
}) => (
  <div style={styles.container}>
    <div style={{ flex: 1 }}>
      {crosslistings.length > 0 && (
        <p style={styles.description}>{`Crosslisted with: ${crosslistings}`}</p>
      )}
      <p style={styles.description}>{description}</p>
    </div>
  </div>
);

CourseDescription.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  crosslistings: PropTypes.string.isRequired,
  antireqs: PropTypes.array.isRequired,
  coreqs: PropTypes.array.isRequired,
  prereqs: PropTypes.object.isRequired,
  postreqs: PropTypes.array.isRequired,
};

export default CourseDescription;

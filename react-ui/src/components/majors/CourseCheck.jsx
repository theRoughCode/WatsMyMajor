import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';


const styles = {
  iconStyle: {
    left: 0,
  },
  labelStyle: {
    width: '100%',
  },
  checkbox: {
    marginTop: 10,
    width: 'auto',
    marginLeft: 20,
    textAlign: 'left',
  }
};

const CourseCheck = ({ subject, catalogNumber, onCheck }) => (
  <Checkbox
    label={ `${subject} ${catalogNumber}` }
    onCheck={ onCheck }
    labelStyle={ styles.labelStyle }
    iconStyle={ styles.iconStyle }
    style={ styles.checkbox }
  />
);

CourseCheck.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default CourseCheck;

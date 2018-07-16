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

const OptionCheck = ({ options, onCheck }) => {
  const formattedOptions = options.map((option) => {
    switch (option.type) {
      case "sum":
        return '(' + option.courses
          .map(({ subject, catalogNumber }) => `${subject} ${catalogNumber}`)
          .join(' & ') + ')';
      default:
        return `${option.subject} ${option.catalogNumber}`;
    }
  });
  return (
    <Checkbox
      label={ formattedOptions.join('/') }
      onCheck={ onCheck }
      labelStyle={ styles.labelStyle }
      iconStyle={ styles.iconStyle }
      style={ styles.checkbox }
    />
  );
}

OptionCheck.propTypes = {
  options: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default OptionCheck;

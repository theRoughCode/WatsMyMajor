import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  iconStyle: {
    left: 0,
  },
  labelStyle: {
    width: '100%',
    color: 'inherit'
  },
  checkbox: {
    marginTop: 10,
    width: 'auto',
    marginLeft: 20,
    textAlign: 'left',
  },
  indentedChecks: {
    marginTop: 0,
    marginLeft: 50,
  },
  innerChecks: {
    width: 'auto',
    textAlign: 'left',
  },
  innerIcon: {
    left: 0,
    width: 20,
  }
};

const LevelCheck = ({ subject, level, excluding, choose, onCheck }) => {
  const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
  return (
    <div>
      <Checkbox
        label={ `${subject} ${level} - level${excludingStr}` }
        onCheck={ onCheck }
        labelStyle={ styles.labelStyle }
        iconStyle={ styles.iconStyle }
        style={ styles.checkbox }
        disabled={ choose > 1 }
      />
      { (choose > 1) && (
        <div style={ styles.indentedChecks }>
          { Array.from(Array(choose).keys()).map((_, index) => (
            <Checkbox
              key={ index }
              onCheck={ onCheck }
              iconStyle={ styles.innerIcon }
              style={ styles.innerChecks }
            />
          )) }
        </div>
      ) }
    </div>
  );
}

LevelCheck.propTypes = {
  subject: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  choose: PropTypes.number.isRequired,
  excluding: PropTypes.array,
  onCheck: PropTypes.func.isRequired,
};

LevelCheck.defaultProps = {
  excluding: [],
};

export default LevelCheck;

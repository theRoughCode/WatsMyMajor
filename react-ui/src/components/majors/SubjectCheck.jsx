import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
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

const SubjectCheck = ({ subject, level, excluding, choose, note, onCheck }) => {
  const levelStr = (level.length > 0) ? `${level}-level ` : '';
  const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
  return (
    <div data-tip data-for='note'>
      <Checkbox
        label={ `Any ${levelStr}${subject} course${excludingStr}` }
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
      {
        (note.length > 0) && (
          <ReactTooltip id='note' type='info' effect='solid'>
            <span>{ note }</span>
          </ReactTooltip>
        )
      }
    </div>
  );
}

SubjectCheck.propTypes = {
  subject: PropTypes.string.isRequired,
  level: PropTypes.string,
  excluding: PropTypes.array,
  choose: PropTypes.number.isRequired,
  note: PropTypes.string,
  onCheck: PropTypes.func.isRequired,
};

SubjectCheck.defaultProps = {
  level: '',
  excluding: [],
  note: ''
};

export default SubjectCheck;

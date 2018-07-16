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

const AnyCheck = ({ choose, onCheck }) => (
  <div>
    <Checkbox
      label="Any course"
      onCheck={ onCheck }
      iconStyle={ styles.iconStyle }
      labelStyle={ styles.labelStyle }
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
);;

AnyCheck.propTypes = {
  choose: PropTypes.number.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default AnyCheck;

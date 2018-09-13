import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    textAlign: 'left',
    margin: 5,
  },
  choose: {
    marginLeft: 0,
    textAlign: 'left',
  },
  reqs: {
    margin: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    borderLeftStyle: 'solid',
    borderLeftColor: 'rgba(116, 122, 132, 0.5)',
  },
};

const Prereqs = ({ choose, reqs }) => (
  <div style={ styles.container }>
    <span style={ styles.choose }>{ `Choose ${choose} of:` }</span>
    <div style={ styles.reqs }>
      { reqs }
    </div>
  </div>
);

Prereqs.propTypes = {
  choose: PropTypes.number.isRequired,
  reqs: PropTypes.array.isRequired
};

export default Prereqs;

import React from 'react';
import PropTypes from 'prop-types';

const Prereqs = ({ choose, reqs }) => (
  <div className="prereqs">
    <span className="prereqs-choose">{ `Choose ${choose} of:` }</span>
    <div className="prereqs-reqs">
      { reqs }
    </div>
  </div>
);

Prereqs.propTypes = {
	choose: PropTypes.number.isRequired,
	reqs: PropTypes.array.isRequired
};

export default Prereqs;

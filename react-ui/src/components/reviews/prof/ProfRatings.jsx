import React from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import { red, yellow, grey } from 'constants/Colours';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: 'auto 0px',
    marginRight: 10,
  },
  ratingsText: {
    fontSize: 32,
    height: '100%',
    margin: '0 5px',
    color: yellow,
  },
  numRatings: {
    color: grey,
    margin: '0 7px',
    marginBottom: 5,
  }
};

const ProfRatings = ({ rating, numRatings }) => {
  const ratingsText = (numRatings === 1) ? '1 rating' : `${numRatings} ratings`;
  return (
    <div style={ styles.container }>
      <span style={ styles.ratingsText }> { rating }</span>
      <StarRatings
        rating={ rating }
        isSelectable={ false }
        isAggregateRating
        numOfStars={ 5 }
        starRatedColor={ yellow }
        starHoverColor={ red }
        starDimension="25px"
        starSpacing="1px"
      />
      <span style={ styles.numRatings }>{ ratingsText }</span>
    </div>
  );
}

ProfRatings.propTypes = {
  rating: PropTypes.number.isRequired,
  numRatings: PropTypes.number.isRequired,
}

export default ProfRatings;

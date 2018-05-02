import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import StarRatings from 'react-star-ratings';

const styles = {
	stars: {
		starRatedColor: '#ffcc00',
		starWidthAndHeight: '15px',
		starSpacing: '1px'
	}
};


const CourseCard = ({
  subject,
  catalogNumber,
  description,
  rating,
  termsOffered
}) => (
  <Card>
    <CardHeader
      title={ `${subject} ${catalogNumber}` }
      subtitle={
        <StarRatings
					rating={rating}
					isSelectable={false}
					isAggregateRating={true}
					numOfStars={5}
					{...styles.stars}
				/>
      }
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardActions>
      <FlatButton label="See more" />
      <FlatButton label="Quick add" />
    </CardActions>
    <CardText expandable={true}>
      { description }
    </CardText>
  </Card>
);

CourseCard.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  termsOffered: PropTypes.array.isRequired
}

export default CourseCard;

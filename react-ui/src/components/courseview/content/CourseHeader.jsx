import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';

const styles = {
	stars: {
		starRatedColor: '#ffcc00',
		starWidthAndHeight: '25px',
		starSpacing: '1px'
	}
};

const CourseHeader = (props) => {
	const {
		subject,
		catalogNumber,
		title,
		rating,
		offered
	} = props;

	return (
		<div className="course-header">
			<div className="course-code">
				<h1>{subject} {catalogNumber}</h1>
				<StarRatings
					rating={rating}
					isSelectable={false}
					isAggregateRating={true}
					numOfStars={5}
					{...styles.stars}
					/>
				{offered.length && (
					<span>Offered in: {offered.join(', ')}</span>
				)}
			</div>
			<span className="title">{title}</span>
		</div>
	);
};

CourseHeader.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	offered: PropTypes.array.isRequired
};

export default CourseHeader;

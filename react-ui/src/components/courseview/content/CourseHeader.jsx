import React from 'react';
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
		termsOffered
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
				{termsOffered.length && (
					<span>Offered in: {termsOffered.join(', ')}</span>
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
	termsOffered: PropTypes.array.isRequired
};

export default CourseHeader;

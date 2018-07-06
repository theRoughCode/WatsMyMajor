import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import StarRatings from 'react-star-ratings';
import CartIcon from 'material-ui/svg-icons/maps/local-grocery-store';
import RemoveCartIcon from 'material-ui/svg-icons/action/remove-shopping-cart';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

const styles = {
	button: {
		margin: '10px auto',
		fontSize: 13,
	},
	stars: {
		starRatedColor: '#ffcc00',
		starDimension: '25px',
		starSpacing: '1px'
	},
	taken: {
		display: 'flex',
		alignItems: 'center',
		margin: '5px 0',
		color: '#2e9619'
	}
};

const CourseHeader = (props) => {
	const {
		subject,
		catalogNumber,
		title,
		rating,
		termsOffered,
		addToCartHandler,
		removeFromCartHandler,
		taken,
		inCart,
		eligible
	} = props;

	const cartButton = (inCart)
		? <RaisedButton
				onClick={() => removeFromCartHandler(subject, catalogNumber)}
				label="Remove From Cart"
				backgroundColor="#ef4f59"
				style={styles.button}
				icon={<RemoveCartIcon />}
			/>
		: <RaisedButton
				onClick={() => addToCartHandler(subject, catalogNumber)}
				label="Add To Cart"
				backgroundColor="#a4c639"
				style={styles.button}
				icon={<CartIcon />}
			/>;

		let takeStatus = null;
		if (taken) {
			takeStatus = "You've taken this course";
		} else if (eligible) {
			takeStatus = "You are eligible to take this course";
		}

	return (
		<div className="course-header">
			<div className="course-header-left">
				<div className="course-code">
					<h1>{subject} {catalogNumber}</h1>
					<StarRatings
						rating={rating}
						isSelectable={false}
						isAggregateRating={true}
						numOfStars={5}
						{...styles.stars}
					/>
				</div>
				<span className="title">{title}</span>
				{
					takeStatus && (
						<div style={styles.taken}>
							<CheckIcon style={{ marginRight: 5 }} />
							<span>{ takeStatus }</span>
						</div>
					)
				}
			</div>
			<div className="course-header-right">
				{termsOffered.length > 0 && (
					<span>Offered in: {termsOffered.join(', ')}</span>
				)}
				{ cartButton }
			</div>
		</div>
	);
};

CourseHeader.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	termsOffered: PropTypes.array.isRequired,
	addToCartHandler: PropTypes.func.isRequired,
	removeFromCartHandler: PropTypes.func.isRequired,
	taken: PropTypes.bool.isRequired,
	inCart: PropTypes.bool.isRequired,
	eligible: PropTypes.bool.isRequired,
};

export default CourseHeader;

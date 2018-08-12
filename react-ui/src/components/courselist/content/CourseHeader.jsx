import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import StarRatings from 'react-star-ratings';
import CartIcon from 'material-ui/svg-icons/maps/local-grocery-store';
import RemoveCartIcon from 'material-ui/svg-icons/action/remove-shopping-cart';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

const styles = {
	container: {
		borderBottom: '1px solid #dbdbdb',
	  textAlign: 'left',
	  width: '100%',
	  display: 'flex',
	  justifyContent: 'flex-end',
		paddingBottom: 10,
	},
	leftContainer: {
		display: 'flex',
	  flexDirection: 'column',
		width: '70%',
	},
	courseCodeContainer: {
		display: 'flex',
	},
	courseCode: {
		fontSize: 40,
	  fontWeight: 400,
	  margin: 'auto 0',
	  whiteSpace: 'nowrap',
	},
	stars: {
	  color: '#5c5f63',
		margin: 'auto 20px',
	},
	rightContainer: {
		display: 'flex',
	  flexDirection: 'column',
		width: '30%',
		paddingTop: 10,
	},
	terms: {
		margin: '0 auto',
	},
	button: {
		margin: '10px auto',
		fontSize: 13,
	},
	taken: {
		display: 'flex',
		alignItems: 'center',
		margin: '5px 0',
		color: '#2e9619'
	}
};

const CourseHeader = ({
	subject,
	catalogNumber,
	title,
	rating,
	url,
	termsOffered,
	addToCartHandler,
	removeFromCartHandler,
	taken,
	inCart,
	eligible
}) => {
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
		<div style={ styles.container }>
			<div style={ styles.leftContainer }>
				<div className="course-code" style={ styles.courseCodeContainer }>
					<h1 style={ styles.courseCode }>{subject} {catalogNumber}</h1>
					<StarRatings
						rating={rating}
						isSelectable={false}
						isAggregateRating={true}
						numOfStars={5}
						starRatedColor="#ffcc00"
						starDimension="25px"
						starSpacing="1px"
					/>
				</div>
				<a href={ url } className="course-header-title">{ title }</a>
				{
					takeStatus && (
						<div style={ styles.taken} >
							<CheckIcon style={{ marginRight: 5 }} />
							<span>{ takeStatus }</span>
						</div>
					)
				}
			</div>
			<div style={ styles.rightContainer }>
				{termsOffered.length > 0 && (
					<span style={ styles.terms }>Offered in: {termsOffered.join(', ')}</span>
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

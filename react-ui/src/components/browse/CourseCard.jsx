import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const CourseCard = ({
	title,
  subject,
  catalogNumber,
  description,
	taken,
	inCart,
	addToCart,
}) => (
  <Card className="course-card">
		<div className="card-content">
			<div className="card-header">
				<CardHeader
					title={ `${subject} ${catalogNumber}` }
					subtitle={ title }
					style={{ textAlign: 'left' }}
					titleStyle={{ marginBottom: 5 }}
				/>
			</div>
			<div className="overlay">
				<div className="overlay-text">
					{ description }
				</div>
			</div>
		</div>
		<CardActions>
			<Link to={ `/courses/${subject}/${catalogNumber}` }>
				<FlatButton label="See more" />
			</Link>
			<FlatButton
				label="Quick add"
				disabled={ taken || inCart }
				onClick={ addToCart }
			/>
		</CardActions>
  </Card>
);

CourseCard.propTypes = {
	title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
	taken: PropTypes.bool.isRequired,
	inCart: PropTypes.bool.isRequired,
	addToCart: PropTypes.func.isRequired,
}

export default CourseCard;

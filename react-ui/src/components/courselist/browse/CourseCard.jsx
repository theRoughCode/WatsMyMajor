import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader } from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

const CourseCard = ({
	title,
  subject,
  catalogNumber,
  description,
  rating
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
			<Button>See more</Button>
			<Button>Quick add</Button>
		</CardActions>
  </Card>
);

CourseCard.propTypes = {
	title: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
}

export default CourseCard;

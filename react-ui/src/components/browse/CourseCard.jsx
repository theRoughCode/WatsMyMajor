import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	container: {
		position: 'relative',
	  width: 250,
	  margin: 20,
	},
	content: {
		width: '100%',
	  height: 'auto',
	  flexGrow: 1,
	},
	header: {
		width: '100%',
	},
	overlayContainer: {
		display: 'flex',
	  position: 'absolute',
	  top: 0,
	  bottom: 0,
	  left: 0,
	  right: 0,
	  width: '100%',
	  opacity: 0,
	  transition: '.3s ease',
	  backgroundColor: '#f2f7f9',
	},
	overlayText: {
		height: '50%',
	  overflow: 'hidden',
	  margin: 15,
		textAlign: 'left',
	}
};

const CourseCard = ({
	title,
  subject,
  catalogNumber,
  description,
	taken,
	inCart,
	addToCart,
}) => (
  <Card className="course-card" style={ styles.container }>
		<div style={ styles.content }>
			<div style={ styles.header }>
				<CardHeader
					title={ `${subject} ${catalogNumber}` }
					subtitle={ title }
					style={{ textAlign: 'left' }}
					titleStyle={{ marginBottom: 5 }}
					subtitleStyle={{ marginRight: -70 }}
				/>
			</div>
			<div className="overlay" style={ styles.overlayContainer }>
				<div style={ styles.overlayText }>
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

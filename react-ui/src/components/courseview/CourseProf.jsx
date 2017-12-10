import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import FontAwesome from 'react-fontawesome';
import { Line } from 'rc-progress';
import StarRatings from 'react-star-ratings';
import profAvatar from '../../images/prof.jpg';

const styles = {
	stars: {
		starRatedColor: '#ffdd00',
		starWidthAndHeight: '15px',
		starSpacing: '1px'
	},
	divider: {
		borderTop: '1px solid #eeeeee',
		backgroundColor: 'inherit'
	},
	progress: {
		width: '50%',
		height: '100%',
		margin: 'auto',
		marginLeft: '10px'
	},
	icon: {
		width: '20px',
		height: '20px',
		marginRight: '10px'
	},
	chip: {
    margin: 4
  }
};


const ProfHeader = ({ name, stars, image }) => (
	<div className="course-prof-header">
		<Avatar
			className="avatar-icon"
			src={image}
			size={50}
			/>
		<div className="course-prof-header-name">
			{name}
			<StarRatings
					rating={stars}
					isSelectable={false}
					isAggregateRating={ true }
					numOfStars={5}
					{...styles.stars}
				/>
		</div>
	</div>
);

// Display ratings of professor taken from RateMyProfessor.com
const Rating = ({ difficulty, tags }) => {
	const percentage = (Number(difficulty) / 5.0) * 100;
	const barColour = (percentage > 66)
											? '#ff1111'
											: (percentage > 33)
												? '#ffb20c'
												: '#b4d235';
	return (
		<div className="course-prof-rating">
			<div className="course-prof-rating-difficulty">
				<span>Difficulty:</span>
				<Line
					style={styles.progress}
					strokeWidth="8"
					strokeColor={barColour}
					trailWidth="8"
					percent={`${percentage}`}
					/>
			</div>
			<div className="course-prof-rating-tags">
				{tags.map((tag) => (
					<Chip
	          style={styles.chip}
	        >
	          {tag}
	        </Chip>
				))}
			</div>
		</div>
	);
};

const Share = ({ icon, text }) => (
	<div className="course-prof-share">
		{icon}
		<a href="#">{text}</a>
	</div>
);


const CourseProf = ({ style }) => {

	return (
		<Paper style={style} zDepth={1}>
			<ProfHeader
				name={'Firas Mansour'}
				stars={4.1}
				image={profAvatar}
				/>
			<Divider style={styles.divider} />
			<Rating
				difficulty={3.2}
				tags={['Hilarious', 'Respected', 'Amazing Lectures']}
				/>
			<Divider style={styles.divider} />
			<Share
				icon={<FontAwesome
	        name='facebook'
					style={styles.icon}
	      />}
				text={'Share on Facebook'}
				/>
			<Divider style={styles.divider} />
			<Share
				icon={<FontAwesome
	        name='twitter'
					style={styles.icon}
	      />}
				text={'Share on Twitter'}
				/>
		</Paper>
	);
};

CourseProf.propTypes = {
	style: PropTypes.object.isRequired
}

export default CourseProf;

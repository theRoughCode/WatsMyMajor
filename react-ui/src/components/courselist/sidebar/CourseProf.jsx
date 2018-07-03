import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import FontAwesome from 'react-fontawesome';
import { Line } from 'rc-progress';
import StarRatings from 'react-star-ratings';

const styles = {
	stars: {
		starRatedColor: '#ffcc00',
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
  },
	loading: {
		margin: 'auto',
		padding: 20
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
					isAggregateRating={true}
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
				{tags.map((tag, index) => (
					<Chip
	          style={styles.chip}
            key={index}
	        >
	          {tag}
	        </Chip>
				))}
			</div>
		</div>
	);
};

const Share = ({ icon, text, link='#' }) => (
	<div className="course-prof-share">
		{icon}
		<a href={link} target='_blank'>{text}</a>
	</div>
);


const CourseProf = (props) => {
  const {
		style,
    instructor,
		loading,
    rating,
    difficulty,
    tags,
    rmpURL,
		profAvatarURL
  } = props;

	const loadingView = (
		<Paper style={style} zDepth={1}>
			<div className="loading">
				<CircularProgress
					size={40}
					thickness={5}
					style={styles.loading}
					/>
			</div>
		</Paper>
	);

	const renderedView = (
		<Paper style={style} zDepth={1}>
			<ProfHeader
				name={instructor}
				stars={rating}
				image={profAvatarURL}
				/>
			<Divider style={styles.divider} />
			<Rating
				difficulty={difficulty}
				tags={tags}
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
			<Divider style={styles.divider} />
			<Share
				icon={<FontAwesome
	        name='globe'
					style={styles.icon}
	      />}
				text={'See on RateMyProf.com'}
        link={rmpURL}
				/>
		</Paper>
	)

	if (loading) return loadingView;
	else if (!rmpURL) return null;
	else return renderedView;
};

CourseProf.propTypes = {
	style: PropTypes.object.isRequired,
  instructor: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
  rating: PropTypes.number,
  difficulty: PropTypes.number,
  tags: PropTypes.array,
  rmpURL: PropTypes.string,
	profAvatarURL: PropTypes.string
}

CourseProf.defaultProps = {
	rating: 0,
	difficulty: 0,
	tags: [],
	rmpURL: '',
	profAvatarURL: ''
}

export default CourseProf;

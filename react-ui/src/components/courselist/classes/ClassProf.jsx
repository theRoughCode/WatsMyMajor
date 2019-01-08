import React from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import FontAwesome from 'react-fontawesome';
import { Line } from 'rc-progress';
import StarRatings from 'react-star-ratings';
import { lightGreen2, yellow, red } from 'constants/Colours';

const styles = {
  container: {
    display: 'inline-block',
    paddingLeft: 20,
    borderLeft: '2px solid #eeeeee',
  },
  stars: {
    starRatedColor: yellow,
    starDimension: '15px',
    starSpacing: '1px'
  },
  divider: {
    borderTop: '1px solid #eeeeee',
    backgroundColor: 'inherit'
  },
  progress: {
    width: 170,
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
    margin: 2,
  },
  chipLabel: {
    fontSize: 12,
  },
  loading: {
    margin: 'auto',
    padding: 20
  },
  prof: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    margin: 'auto',
    marginLeft: 10,
    fontSize: 20,
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  ratingDifficulty: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    padding: 20,
  },
  ratingTags: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    padding: 20,
  },
  shareContainer: {
    textAlign: 'left',
    fontSize: 15,
    padding: '10px 20px',
    paddingBottom: 0,
  }
};


const ProfHeader = ({ name, stars }) => (
  <div style={ styles.prof }>
    { name }
    <StarRatings
      rating={ stars }
      isSelectable={ false }
      isAggregateRating
      numOfStars={ 5 }
      { ...styles.stars }
    />
  </div>
);

// Display ratings of professor taken from RateMyProfessor.com
const Rating = ({ difficulty, tags }) => {
  const percentage = (Number(difficulty) / 5.0) * 100;
  const barColour = (percentage > 66)
    ? red
    : (percentage > 33)
      ? yellow
      : lightGreen2;
  return (
    <div style={ styles.ratingContainer }>
      <div style={ styles.ratingDifficulty }>
        <span>Difficulty:</span>
        <Line
          style={ styles.progress }
          strokeWidth="8"
          strokeColor={ barColour }
          trailWidth="8"
          percent={ `${percentage}` }
        />
      </div>
      <div style={ styles.ratingTags }>
        { tags.map((tag, index) => (
          <Chip
            style={ styles.chip }
            labelStyle={ styles.chipLabel }
            key={ index }
          >
            { tag }
          </Chip>
        )) }
      </div>
    </div>
  );
};

Rating.propTypes = {
  difficulty: PropTypes.number,
  tags: PropTypes.array,
};

Rating.defaultProps = {
  difficulty: 0,
  tags: [],
};


const ClassProf = ({
  instructor,
  loading,
  prof
}) => {
  const {
    rating,
    difficulty,
    tags,
    rmpURL,
  } = prof;

  const loadingView = (
    <div style={ styles.loading } className="loading">
      <CircularProgress
        size={ 40 }
        thickness={ 5 }
        style={ styles.loading }
      />
    </div>
  );

  const renderedView = (
    <div style={ styles.container }>
      <ProfHeader
        name={ instructor }
        stars={ rating }
      />
      <Divider style={ styles.divider } />
      <Rating
        difficulty={ difficulty }
        tags={ tags }
      />
      <Divider style={ styles.divider } />
      <div style={ styles.shareContainer }>
        <FontAwesome name='globe' style={ styles.icon } />
        <a className="course-prof-share" rel="noopener noreferrer" href={ rmpURL } target='_blank'>See on RateMyProf.com</a>
      </div>
    </div>
  )

  if (loading) return loadingView;
  else if (!rmpURL) return null;
  else return renderedView;
};

ClassProf.propTypes = {
  instructor: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  prof: PropTypes.object.isRequired,
};

export default ClassProf;

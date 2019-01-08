import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';
import { red, yellow, grey } from 'constants/Colours';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap-reverse',
    margin: 'auto 0px',
    marginRight: 10,
  },
  numRatingsText: {
    fontSize: 13,
    height: 'fit-content',
    margin: 'auto 0px',
    marginLeft: 5,
    color: grey,
  },
};

const updateUserRating = async (username, subject, catalogNumber, rating) => {
  const response = await fetch(`/server/ratings/course/update/${subject}/${catalogNumber}`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      rating,
    }),
    headers: {
      'content-type': 'application/json',
      'x-secret': process.env.REACT_APP_SERVER_SECRET
    }
  });
  if (!response.ok) return null;
  return await response.json();
}


class CourseRatings extends Component {

  static propTypes = {
    avgRating: PropTypes.number.isRequired,
    numRatings: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    catalogNumber: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      avgRating: props.avgRating,
      numRatings: props.numRatings,
    };
  }

  onChangeRating = async (rating) => {
    const { username, subject, catalogNumber } = this.props;
    const updatedRatings = await updateUserRating(username, subject, catalogNumber, rating);
    if (updatedRatings == null) toast.error('Failed to submit rating.  Please contact an administrator.');
    else {
      const { avgRating, numRatings } = updatedRatings;
      this.setState({ avgRating, numRatings });
    }
  }

  render() {
    const { avgRating, numRatings } = this.state;
    const { isLoggedIn } = this.props;
    const starRatings = (isLoggedIn)
      ? (
        <StarRatings
          rating={ avgRating }
          isAggregateRating
          numOfStars={ 5 }
          starRatedColor={ yellow }
          starHoverColor={ red }
          starDimension="25px"
          starSpacing="1px"
          changeRating={ this.onChangeRating }
        />
      )
      : (
        <StarRatings
          rating={ avgRating }
          isSelectable={ false }
          isAggregateRating
          numOfStars={ 5 }
          starRatedColor={ yellow }
          starHoverColor={ red }
          starDimension="25px"
          starSpacing="1px"
        />
      );
    const ratingsText = (numRatings === 1) ? '1 rating' : `${numRatings} ratings`;
    return (
      <div style={ styles.container }>
        { starRatings }
        <span style={ styles.numRatingsText }>{ ratingsText }</span>
      </div>
    );
  }

}

const mapStateToProps = ({ isLoggedIn, user }) => ({
  isLoggedIn,
  username: user.username,
});

export default connect(mapStateToProps)(CourseRatings);

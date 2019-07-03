import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import { red, yellow } from 'constants/Colours';

const styles = {
  container: {
    display: 'flex',
    // flexWrap: 'wrap-reverse',
    alignItems: 'flex-end',
    margin: 'auto 0px',
    marginRight: 10,
  },
  ratingsText: {
    fontSize: 32,
    height: '100%',
    margin: '0 5px',
    color: yellow,
  },
};

// const updateUserRating = async (username, subject, catalogNumber, rating) => {
//   const response = await fetch(`/server/ratings/course/update/${subject}/${catalogNumber}`, {
//     method: 'POST',
//     body: JSON.stringify({
//       username,
//       rating,
//     }),
//     headers: {
//       'content-type': 'application/json',
//       'x-secret': process.env.REACT_APP_SERVER_SECRET
//     }
//   });
//   if (!response.ok) return null;
//   return await response.json();
// }


class ProfRatings extends Component {

  static propTypes = {
    rating: PropTypes.number.isRequired,
    // isLoggedIn: PropTypes.bool.isRequired,
    // username: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      rating: props.rating,
    };
  }

  componentWillReceiveProps({ rating }) {
    this.setState({ rating });
  }

  // onChangeRating = async (rating) => {
  //   const { username, subject, catalogNumber } = this.props;
  //   const updatedRatings = await updateUserRating(username, subject, catalogNumber, rating);
  //   if (updatedRatings == null) toast.error('Failed to submit rating.  Please contact an administrator.');
  //   else {
  //     const { avgRating, numRatings } = updatedRatings;
  //     this.setState({ avgRating, numRatings });
  //   }
  // }

  render() {
    const { rating } = this.state;
    // const { isLoggedIn } = this.props;
    // const starRatings = (isLoggedIn)
    //   ? (
    //     <StarRatings
    //       rating={ avgRating }
    //       isAggregateRating
    //       numOfStars={ 5 }
    //       starRatedColor={ yellow }
    //       starHoverColor={ red }
    //       starDimension="25px"
    //       starSpacing="1px"
    //       changeRating={ this.onChangeRating }
    //     />
    //   )
    //   : (
    //     <StarRatings
    //       rating={ avgRating }
    //       isSelectable={ false }
    //       isAggregateRating
    //       numOfStars={ 5 }
    //       starRatedColor={ yellow }
    //       starHoverColor={ red }
    //       starDimension="25px"
    //       starSpacing="1px"
    //     />
    //   );
    // const ratingsText = (numRatings === 1) ? '1 rating' : `${numRatings} ratings`;
    return (
      <div style={ styles.container }>
        <span style={ styles.ratingsText }> { rating }</span>
        <StarRatings
          rating={ rating }
          isSelectable={ false }
          isAggregateRating
          numOfStars={ 5 }
          starRatedColor={ yellow }
          starHoverColor={ red }
          starDimension="25px"
          starSpacing="1px"
        />
      </div>
    );
  }

}

const mapStateToProps = ({ isLoggedIn, user }) => ({
  isLoggedIn,
  username: user.username,
});

export default connect(mapStateToProps)(ProfRatings);

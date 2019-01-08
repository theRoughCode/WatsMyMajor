import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CourseCard from './CourseCard';
import { hasTakenCourse, isInCart } from 'utils/courses';
import { createSnack, addToCart, removeFromCart } from 'actions';
import 'stylesheets/CourseView.css';

const styles = {
  container: {
    width: '90%',
    height: '100%',
    margin: 'auto',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 'fit-content',
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 400,
    float: 'left',
    marginTop: 40,
    marginLeft: 20,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

class BrowseCourseContainer extends Component {
  static propTypes = {
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
  };

  state = {
    popular: [],
    rated: []
  };

  componentDidMount() {
    this.fetchPopularCourses();
    this.fetchMostRatedCourses();
  }

  fetchPopularCourses = async () => {
    const response = await fetch('/server/stats/course/popular', {
      headers: {
        "x-secret": process.env.REACT_APP_SERVER_SECRET
      }
    });
    if (!response.ok) return;
    const popular = await response.json();
    this.setState({ popular });
  }

  fetchMostRatedCourses = async () => {
    const response = await fetch('/server/stats/course/ratings', {
      headers: {
        "x-secret": process.env.REACT_APP_SERVER_SECRET
      }
    });
    if (!response.ok) return;
    const rated = await response.json();
    this.setState({ rated });
  }

  addToCart = (subject, catalogNumber) => {
    const { cart, username, addToCartHandler } = this.props;
    addToCartHandler(username, cart, subject, catalogNumber);
  }

  render() {
    return (
      <div style={ styles.container }>
        { (this.state.popular.length > 0) && (
          <div style={ styles.innerContainer }>
            <span style={ styles.header }>Most Popular</span>
            <div style={ styles.cardContainer }>
              { this.state.popular.map((course, index) => {
                const { subject, catalogNumber, title, description } = course;
                return (
                  <CourseCard
                    key={ index }
                    taken={ hasTakenCourse(subject, catalogNumber, this.props.myCourses) }
                    inCart={ isInCart(subject, catalogNumber, this.props.cart) }
                    addToCart={ this.addToCart }
                    title={ title }
                    description={ description }
                    subject={ subject }
                    catalogNumber={ catalogNumber }
                    isLoggedIn={ this.props.isLoggedIn }
                  />
                );
              }) }
            </div>
          </div>
        ) }
        { (this.state.rated.length > 0) && (
          <div style={ styles.innerContainer }>
            <span style={ styles.header }>Most Rated</span>
            <div style={ styles.cardContainer }>
              { this.state.rated.map((course, index) => {
                const { subject, catalogNumber, title, description } = course;
                return (
                  <CourseCard
                    key={ index }
                    taken={ hasTakenCourse(subject, catalogNumber, this.props.myCourses) }
                    inCart={ isInCart(subject, catalogNumber, this.props.cart) }
                    addToCart={ this.addToCart }
                    title={ title }
                    description={ description }
                    subject={ subject }
                    catalogNumber={ catalogNumber }
                    isLoggedIn={ this.props.isLoggedIn }
                  />
                );
              }) }
            </div>
          </div>
        ) }
      </div>
    );
  }
}

const mapStateToProps = ({ myCourses, cart, user, isLoggedIn }) => ({
  myCourses,
  cart,
  username: user.username,
  isLoggedIn,
});

const mapDispatchToProps = dispatch => {
  return {
    addToCartHandler: (username, cart, subject, catalogNumber) => {
      const msg = `${subject} ${catalogNumber} has been added to your cart.`;
      const actionMsg = 'undo';
      const undoMsg = `${subject} ${catalogNumber} has been removed from your cart.`;
      const handleActionClick = () => dispatch(removeFromCart(subject, catalogNumber));
      dispatch(addToCart(subject, catalogNumber, username, cart));
      dispatch(createSnack(msg, actionMsg, undoMsg, handleActionClick));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseCourseContainer);

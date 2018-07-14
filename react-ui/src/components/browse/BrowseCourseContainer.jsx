import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CourseCard from './CourseCard';
import { hasTakenCourse, isInCart } from '../../utils/courses';
import { createSnack, addToCart, removeFromCart } from '../../actions';
import '../../stylesheets/CourseView.css';



class BrowseCourseContainer extends Component {
  static propTypes = {
    myCourses: PropTypes.object.isRequired,
    cart: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    addToCartHandler: PropTypes.func.isRequired,
  };

  state = {
    popular: [],
    recommended: []
  };

  componentDidMount() {
    this.fetchPopularCourses();
  }

  async fetchPopularCourses() {
    const response = await fetch('/stats/courses/popular');
    if (!response.ok) return;
    const popular = await response.json();
    this.setState({ popular });
  }

  render() {
    const { style, myCourses, cart, username, addToCartHandler } = this.props;
    return (
      <div className="course-browse">
        { (this.state.popular.length > 0) && (
          <div className="course-card-container">
            <span className="popular-text">Most popular courses</span>
            <div className="browse-popular">
              { this.state.popular.map((course, index) => {
                const { subject, catalogNumber, title, description } = course;
                return (
                  <CourseCard
                    key={index}
                    taken={hasTakenCourse(subject, catalogNumber, myCourses)}
                    inCart={isInCart(subject, catalogNumber, cart)}
                    addToCart={addToCartHandler.bind(this, username, cart, subject, catalogNumber)}
                    title={title}
                    description={description}
                    subject={subject}
                    catalogNumber={catalogNumber}
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

const mapStateToProps = ({ myCourses, cart, user }) => ({
  myCourses,
  cart,
  username: user.username,
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

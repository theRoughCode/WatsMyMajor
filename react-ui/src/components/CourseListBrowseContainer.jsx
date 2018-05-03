import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseCard from './courselist/browse/CourseCard';
import SearchBar from './SearchBar';
import '../stylesheets/CourseView.css';


export default class CourseListBrowseContainer extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      popular: [
        {
          title: 'Elementary Algorithm Design and Data Abstraction',
          subject: 'CS',
          catalogNumber: '136',
          description: 'This course builds on the techniques and patterns learned in CS 135 while making the transition to use an imperative language. It introduces the design and analysis of algorithms, the management of information, and the programming mechanisms and methodologies required in implementations. Topics discussed include iterative and recursive sorting algorithms; lists, stacks, queues, trees, and their application; abstract data types and their implementations.',
          rating: 3.1
        },
        {
          title: 'Calculus 2 For Honours Mathematics',
          subject: 'MATH',
          catalogNumber: '138',
          description: 'Introduction to the Riemann Integral and approximations. Antiderivatives and the Fundamental Theorem of Calculus. Change of variables, Methods of integration. Applications of the integral. Improper integrals. Linear and separable differential equations and applications. Tests for convergence for series. Binomial Series, Functions defined as power series and Taylor series. Vector (parametric) curves in R2. Suitable topics are illustrated using computer software. [Offered: F,W,S]',
          rating: 2.8
        },
        {
          title: 'Interviewing',
          subject: 'SPCOM',
          catalogNumber: '225',
          description: 'Theory and practice of interviewing. A workshop course which teaches theory, design, and presentation of interviews. Videotaping student exercises will enhance interview design and delivery, as well as listening and critical skills.',
          rating: 2.2
        }
      ],
      recommended: [],
    };
  }

  render() {
    return (
      <div className="course-browse">
        <div className="browse-search">
          <span>Search for a course!</span>
          <SearchBar style={{  width: 600 }} />
        </div>
        <div className="course-card-container">
          <span className="popular-text">Most popular courses</span>
          <div className="browse-recommended">
            { this.state.popular.map((course, index) => <CourseCard key={index} { ...course } />) }
          </div>
        </div>
        <div className="browse-popular">
        </div>
      </div>
    );
  }

}

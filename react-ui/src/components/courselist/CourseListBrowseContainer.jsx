import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from 'material-ui-search-bar';
import CourseCard from './browse/CourseCard';


export default class CourseListBrowseContainer extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      popular: [],
      recommended: []
    };
  }

  render() {
    return (
      <div className="course-list-browse">

      </div>
    );
  }

}

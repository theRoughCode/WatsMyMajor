import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


export default class Schedule extends Component {

  static propTypes = {
    term: PropTypes.string,
    courses: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      term: "",
      classes: []
    };
  }

  componentDidMount() {
    fetch('/parse')
    .then(data => data.json())
    .then(({ term, courses }) => {
      const classes = [];

      this.setState({ term, courses });
    });
  }

  render() {
    return (
      <div>MyComponent</div>
    );
  }

}

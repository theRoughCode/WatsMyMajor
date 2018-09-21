import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { VictoryPie, VictoryTheme, VictoryLabel } from 'victory';

const colours = [
  '#00d3ee',
  '#55e0ab',
  '#f7c911',
  '#f55a4e',
  '#a287e5',
];

const formatMyCourses = (data) => {
  const subjects = Object.keys(data);
  return subjects.map((subject, i) => ({
    subject,
    count: Object.keys(data[subject]).length,
    colour: colours[i],
  }));
}


export default class UserCoursesGraph extends Component {
  static propTypes = {
    myCourses: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      courses: formatMyCourses(props.myCourses),
    };
  }

  render() {
    const { courses } = this.state;
    if (courses.length === 0) return null;
    return (
      <Paper style={{ height: 'fit-content', margin: 'auto' }} depth={ 1 }>
        <VictoryLabel
          text="My Courses"
          x={ 225 }
          y={ 30 }
          textAnchor="middle"
          style={{ fontSize: 25 }}
        />
        <VictoryPie
          data={ courses }
          labelRadius={ 130 }
          theme={ VictoryTheme.material }
          x="subject"
          y="count"
          colorScale={ colours }
        />
      </Paper>
    );
  }

}

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory';

const colours = [
  '#54c4a2',
  '#ed3b3b',
  '#4b96f2',
  '#ef9c3e',
  '#af2cc5',
];

const styles = {
  container: {
    width: 400,
    height: 'fit-content',
    margin: 'auto',
    marginBottom: 20,
  },
};

const assignColours = (data) => data.map(({ subject, catalogNumber, count }, index) => ({
  course: `${subject} ${catalogNumber}`,
  count,
  colour: colours[index]
}));


export default class PopularCourseGraph extends Component {
  state = {
    popular: [],
  };

  async componentDidMount() {
    try {
      const response = await fetch('/server/stats/course/popular/5', {
        headers: {
          "x-secret": process.env.REACT_APP_SERVER_SECRET
        }
      });
      if (!response.ok) {
        console.error(`Failed to retrieve popular courses: ${response}`);
        return;
      }
      const data = await response.json();
      this.setState({ popular: assignColours(data) });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { popular } = this.state;
    if (popular.length === 0) return null;

    return (
      <Paper style={ styles.container } depth={ 1 }>
        <VictoryChart domainPadding={ 30 } >
          <VictoryLabel
            text="Popular Courses"
            x={ 225 }
            y={ 30 }
            textAnchor="middle"
            style={{ fontSize: 25 }}
          />
          <VictoryAxis
            label="Courses"
            style={{
              tickLabels: {
                fontFamily: "'Gill Sans', 'Gill Sans MT', 'Ser­avek', 'Trebuchet MS', sans-serif",
                fontSize: 15,
                padding: 5
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="# of Users"
            style={{
              grid: {
                stroke: '#caccd1',
              },
            }}
          />
          <VictoryBar
            data={ popular }
            sortKey="count"
            sortOrder="descending"
            x="course"
            y="count"
            barWidth={ 30 }
            labels={ (c) => c.count }
            animate={{
              onLoad: { duration: 500 }
            }}
            style={{
              data: {
                fill: (c) => c.colour,
                stroke: '#76787f',
                strokeWidth: 1,
              },
            }}
          />
        </VictoryChart>
      </Paper>
    );
  }

}

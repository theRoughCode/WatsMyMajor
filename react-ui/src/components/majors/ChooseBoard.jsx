import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCheck from './CourseCheck';
import RangeCheck from './RangeCheck';

const styles = {
  board: (isFulfilled) => ({
    margin: 20,
    width: 250,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    paddingBottom: 20,
    backgroundColor: (isFulfilled) ? '#8fdb78' : 'inherit',
    border: (isFulfilled) ? '1px solid black' : 'inherit',
  }),
  boardTitle: {
    textAlign: 'left',
  },
};

const renderCourseNode = (node, index, choose, onCheck) => {
  switch (node.type) {
    case "course":
      return (
        <CourseCheck
          subject={ node.subject }
          catalogNumber={ node.catalogNumber }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "range":
      return (
        <RangeCheck
          subject={ node.subject }
          from={ node.from }
          to={ node.to }
          choose={ choose }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "level":
      return (
        <CourseCheck
          subject={ node.subject }
          catalogNumber={ `${node.catalogNumber}-level` }
          key={ index }
          onCheck={ onCheck }
        />
      );
  }
  return null;
};

export default class ChooseBoard extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    choose: PropTypes.number.isRequired,
    courses: PropTypes.array.isRequired,
  };

  state = {
    numChecked: 0,
    fulfilled: false,
  };

  onCheck = (_, isChecked) => {
    let { numChecked } = this.state;
    if (!isChecked) numChecked--;
    else numChecked++;

    const fulfilled = numChecked === this.props.choose;
    this.setState({ numChecked, fulfilled });
  }

  render() {
    const { choose, courses, title } = this.props;
    return (
      <Paper style={ styles.board(this.state.fulfilled) }>
        <span style={ styles.boardTitle }>{ title }</span>
        { courses.map((node, i) => renderCourseNode(node, i, choose, this.onCheck)) }
      </Paper>
    );
  }

}

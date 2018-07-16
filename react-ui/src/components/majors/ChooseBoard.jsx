import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCheck from './CourseCheck';
import RangeCheck from './RangeCheck';
import LevelCheck from './LevelCheck';
import OptionCheck from './OptionCheck';
import SubjectCheck from './SubjectCheck';
import AnyCheck from './AnyCheck';

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
          excluding={ node.excluding || [] }
          choose={ choose }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "level":
      return (
        <LevelCheck
          subject={ node.subject }
          level={ node.catalogNumber }
          excluding={ node.excluding }
          choose={ choose }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "option":
      return (
        <OptionCheck
          options={ node.options }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "subject":
      return (
        <SubjectCheck
          subject={ node.subject }
          choose={ choose }
          note={ node.note }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "subject-level":
      return (
        <SubjectCheck
          subject={ node.subject }
          level={ node.catalogNumber }
          excluding={ node.excluding }
          choose={ choose }
          key={ index }
          onCheck={ onCheck }
        />
      );
    case "any":
      return (
        <AnyCheck
          choose={ choose }
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

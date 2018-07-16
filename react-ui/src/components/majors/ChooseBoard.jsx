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
    backgroundColor: (isFulfilled) ? '#baefb8' : 'inherit',
    border: (isFulfilled) ? '1px solid black' : 'inherit',
  }),
  boardTitle: {
    textAlign: 'left',
  },
};

const renderCourseNode = (node, index, choose, myCourses, onCheck) => {
  switch (node.type) {
    case "course":
      return (
        <CourseCheck
          subject={ node.subject }
          catalogNumber={ node.catalogNumber }
          key={ index }
          onCheck={ onCheck }
          myCourses={ myCourses }
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
    default: return null;
  }
};

// We need this so that set state happens synchonously
// https://medium.com/@wereHamster/beware-react-setstate-is-asynchronous-ce87ef1a9cf3
const incrementChecked = () => ({ numChecked }, { choose }) => {
  numChecked++;
  const fulfilled = numChecked >= choose;
  return { numChecked, fulfilled };
};
const decrementChecked = () => ({ numChecked }, { choose }) => {
  numChecked--;
  const fulfilled = numChecked >= choose;
  return { numChecked, fulfilled };
};

export default class ChooseBoard extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    choose: PropTypes.number.isRequired,
    courses: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
  };

  state = {
    numChecked: 0,
    fulfilled: false,
  };

  onCheck = (_, isChecked) => {
    if (!isChecked) {
      this.setState(decrementChecked());
    } else {
      this.setState(incrementChecked());
    }
  }

  render() {
    const { choose, courses, title } = this.props;
    return (
      <Paper style={ styles.board(this.state.fulfilled) }>
        <span style={ styles.boardTitle }>{ title }</span>
        { courses.map((node, i) =>
            renderCourseNode(node, i, choose, this.props.myCourses, this.onCheck)) }
      </Paper>
    );
  }

}

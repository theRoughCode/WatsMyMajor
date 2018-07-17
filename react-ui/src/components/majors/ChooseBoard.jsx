import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCheck from './CourseCheck';
import RangeCheck from './RangeCheck';
import LevelCheck from './LevelCheck';
import OptionCheck from './OptionCheck';
import SubjectCheck from './SubjectCheck';
import AnyCheck from './AnyCheck';
import { arrayOfObjectEquals } from '../../utils/arrays';

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
          myCourses={ myCourses }
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

// We need this callback so that set state happens synchonously when updating
// the numChecked counter
// https://medium.com/@wereHamster/beware-react-setstate-is-asynchronous-ce87ef1a9cf3
const incrementChecked = (delta) => ({ numChecked }, { choose }) => {
  numChecked += delta;
  const fulfilled = numChecked >= choose;
  return { numChecked, fulfilled };
};
// Resets the numChecked counter and fulfilled boolean when major is changed
const resetChecked = () => ({ numChecked }) => ({ numChecked: 0, fulfilled: false });

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

  componentWillReceiveProps(nextProps) {
    if (!arrayOfObjectEquals(nextProps.courses, this.props.courses)) {
      this.setState(resetChecked());
    }
  }

  onCheck = (_, isChecked, delta = 1) => {
    if (!isChecked) {
      this.setState(incrementChecked(-delta));
    } else {
      this.setState(incrementChecked(delta));
    }
  }

  onReset = () => {
    this.setState(resetChecked());
  }

  render() {
    const { choose, courses, title } = this.props;
    return (
      <Paper style={ styles.board(this.state.fulfilled) }>
        <span style={ styles.boardTitle }>{ title }{ this.state.numChecked }</span>
        { courses.map((node, i) =>
            renderCourseNode(node, i, choose, this.props.myCourses, this.onCheck)) }
      </Paper>
    );
  }

}

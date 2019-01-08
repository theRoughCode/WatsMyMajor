import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import CourseCheck from './CourseCheck';
import RangeCheck from './RangeCheck';
import LevelCheck from './LevelCheck';
import OptionCheck from './OptionCheck';
import AnyCheck from './AnyCheck';
import { arrayOfObjectEquals } from 'utils/arrays';
import { lightGreen } from 'constants/Colours';

const styles = {
  board: (isFulfilled) => ({
    margin: 20,
    minWidth: 200,
    width: 'fit-content',
    minHeight: 'fit-content',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    paddingBottom: 20,
    backgroundColor: (isFulfilled) ? lightGreen : 'inherit',
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
        key={ index }
        subject={ node.subject }
        catalogNumber={ node.catalogNumber }
        onCheck={ onCheck }
        myCourses={ myCourses }
      />
    );
  case "range":
    return (
      <RangeCheck
        key={ index }
        subject={ node.subject }
        from={ node.from }
        to={ node.to }
        excluding={ node.excluding || [] }
        choose={ choose }
        onCheck={ onCheck }
        myCourses={ myCourses }
      />
    );
  case "level":
  case "subject":
  case "subject-level":
    return (
      <LevelCheck
        key={ index }
        subject={ node.subject }
        level={ node.catalogNumber }
        excluding={ node.excluding }
        choose={ choose }
        note={ node.note }
        onCheck={ onCheck }
        myCourses={ myCourses }
      />
    );
  case "option":
    return (
      <OptionCheck
        key={ index }
        options={ node.options }
        myCourses={ myCourses }
        onCheck={ onCheck }
      />
    );
  case "any":
    return (
      <AnyCheck
        key={ index }
        choose={ choose }
        myCourses={ myCourses }
        onCheck={ onCheck }
      />
    );
  default: return null;
  }
};

// We need this callback so that set state happens synchonously when updating
// the numChecked counter
// https://medium.com/@wereHamster/beware-react-setstate-is-asynchronous-ce87ef1a9cf3
const incrementChecked = (delta) => ({ numChecked }, { choose, courses }) => {
  numChecked += delta;
  if (choose === 0) choose = courses.length;  // Choose all
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
        <span style={ styles.boardTitle }>{ title }</span>
        { courses.map((node, i) =>
          renderCourseNode(node, i, choose, this.props.myCourses, this.onCheck)) }
      </Paper>
    );
  }

}

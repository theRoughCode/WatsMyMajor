import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { arrayOfObjectEquals } from 'utils/arrays';
import { hasTakenCourse } from 'utils/courses';
import { green2 } from 'constants/Colours';

const styles = {
  iconStyle: {
    left: 0,
  },
  labelStyle: (taken) => ({
    width: '100%',
    color: (taken) ? green2 : 'inherit'
  }),
  checkbox: {
    marginTop: 10,
    width: 'auto',
    textAlign: 'left',
  }
};

const hasTakenOption = (option, myCourses) => {
  switch (option.type) {
  case "sum":
    for (let i = 0; i < option.courses.length; i++) {
      const { subject, catalogNumber } = option.courses[i];
      if (!hasTakenCourse(subject, catalogNumber, myCourses)) return false;
    }
    // Mark as taken
    for (let i = 0; i < option.courses.length; i++) {
      const { subject, catalogNumber } = option.courses[i];
      myCourses[subject][catalogNumber] = true;
    }
    return true;
  default: {
    const { subject, catalogNumber } = option;
    const taken = hasTakenCourse(subject, catalogNumber, myCourses);
    if (taken) myCourses[subject][catalogNumber] = true;
    return taken;
  }
  }
}

export default class OptionCheck extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
  };

  state = {
    taken: false,
    isChecked: false
  };

  componentDidMount() {
    const { options, myCourses } = this.props;
    this.checkTaken(options, myCourses);
  }

  componentWillReceiveProps(nextProps) {
    const { options, myCourses } = nextProps;
    if (!arrayOfObjectEquals(options, this.props.options)) {
      this.checkTaken(options, myCourses);
    }
  }

  checkTaken = (options, myCourses) => {
    let taken = false;
    for (var i = 0; i < options.length; i++) {
      if (hasTakenOption(options[i], myCourses)) {
        taken = true;
        break;
      }
    }
    // If at least one option is taken, increment count by 1
    if (taken) this.props.onCheck(null, true);
    this.setState({ taken, isChecked: taken });
  }

  onCheck = (ev, isChecked) => {
    this.setState({ isChecked });
    this.props.onCheck(ev, isChecked);
  }

  render() {
    const { options } = this.props;
    const formattedOptions = options.map((option) => {
      switch (option.type) {
      case "sum":
        return '(' + option.courses
          .map(({ subject, catalogNumber }) => `${subject} ${catalogNumber}`)
          .join(' & ') + ')';
      default:
        return `${option.subject} ${option.catalogNumber}`;
      }
    });
    return (
      <Checkbox
        label={ formattedOptions.join('/') }
        checked={ this.state.isChecked }
        disabled={ this.state.taken }
        onCheck={ this.onCheck }
        labelStyle={ styles.labelStyle(this.state.taken) }
        iconStyle={ styles.iconStyle }
        style={ styles.checkbox }
      />
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { green2 } from 'constants/Colours';

const styles = {
  iconStyle: {
    left: 0,
  },
  labelStyle: (taken) => ({
    width: '100%',
    color: (taken) ? green2 : 'inherit',
  }),
  checkbox: {
    marginTop: 10,
    width: 'auto',
    textAlign: 'left',
  },
  indentedChecks: {
    marginTop: 0,
    marginLeft: 10,
  },
  innerChecks: {
    width: 'auto',
    textAlign: 'left',
  },
  innerIcon: {
    left: 0,
    width: 20,
  }
};

// Check if taken a course in range and not in the excluding list
const getTakenCoursesInRange = (subject, from, to, excluding, myCourses) => {
  if (myCourses[subject] == null) return [];
  const fromNum = Number(from.trim());
  const toNum = Number(to.trim());
  if (isNaN(from)) {
    console.error(`From: ${from} is not a number!`);
    return [];
  }
  if (isNaN(to)) {
    console.error(`To: ${to} is not a number!`);
    return [];
  }

  const catNums = Object.keys(myCourses[subject]);
  return catNums.filter((catNum) => {
    // Skip courses that have already been used to fulfill another requirement
    if (myCourses[subject][catNum]) return false;
    const num = Number(catNum.replace(/\D/g,'').trim());
    if (isNaN(num)) {
      console.error(`Catalog number ${num} (${catNum}) is not a number!`);
      return false;
    }
    if (num < fromNum || num > toNum) return false;
    // Check if course is in exclude list
    for (let i = 0; i < excluding.length; i++) {
      if (catNum === excluding[i]) return false;
    }
    // Mark course as taken
    myCourses[subject][catNum] = true;
    return true;
  });
}

export default class RangeCheck extends Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    choose: PropTypes.number.isRequired,
    excluding: PropTypes.array.isRequired,
    myCourses: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
  };

  state = {
    taken: false,
    isChecked: false,
    children: [],
  };

  componentDidMount() {
    const { subject, from, to, excluding, myCourses, choose } = this.props;
    const children = Array.from(Array(choose).keys()).map(() =>
      ({ subject: '', catalogNumber: '', checked: false, taken: false }));
    this.setState({ children });
    this.checkTaken(subject, from, to, excluding, children, myCourses);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, from, to, excluding, myCourses } = nextProps;
    if (subject !== this.props.subject
      || from !== this.props.from
      || to !== this.props.to) {
      this.checkTaken(subject, from, to, excluding, this.state.children, myCourses);
    }
  }

  checkTaken = (subject, from, to, excluding, children, myCourses) => {
    const takenCourses = getTakenCoursesInRange(subject, from, to, excluding, myCourses);
    if (takenCourses.length === 0) return;

    // If course is taken, increment count by 1
    if (this.props.choose === 1) {
      this.props.onCheck(null, true);
      this.setState({ taken: true, isChecked: true });
    } else {
      this.props.onCheck(null, true, takenCourses.length);
      takenCourses.forEach((catalogNumber, index) => {
        children[index] = { subject, catalogNumber, checked: true, taken: true };
      });
      this.setState({ children });
    }
  }

  onCheck = (index, isChecked) => {
    // Toggle main checkbox
    if (index === -1) {
      this.setState({ isChecked });
      this.props.onCheck(null, isChecked);
    } else {
      const { children } = this.state;
      children[index].checked = isChecked;
      this.setState({ children });
      this.props.onCheck(null, isChecked);
    }
  }

  render() {
    const { subject, from, to, choose, excluding } = this.props;
    const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
    return (
      <div>
        <Checkbox
          label={ `${subject} ${from} - ${subject} ${to}${excludingStr}` }
          checked={ this.state.isChecked }
          onCheck={ (_, isChecked) => this.onCheck(-1, isChecked) }
          iconStyle={ styles.iconStyle }
          labelStyle={ styles.labelStyle(this.state.taken) }
          style={ styles.checkbox }
          disabled={ choose > 1 || this.state.taken }
        />
        { (choose > 1) && (
          <div style={ styles.indentedChecks }>
            {
              this.state.children.map(({ subject, catalogNumber, checked, taken }, index) => {
                const label = (subject.length > 0) ? `${subject} ${catalogNumber}` : '';
                return (
                  <Checkbox
                    key={ index }
                    label={ label }
                    checked={ checked }
                    disabled={ taken }
                    onCheck={ (_, isChecked) => this.onCheck(index, isChecked) }
                    labelStyle={ styles.labelStyle(taken) }
                    iconStyle={ styles.innerIcon }
                    style={ styles.innerChecks }
                  />
                );
              })
            }
          </div>
        ) }
      </div>
    );
  }
}

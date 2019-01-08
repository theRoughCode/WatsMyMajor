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


const getTakenCourses = (myCourses, limit) => {
  const taken = [];
  let numTaken = 0;
  for (let subject in myCourses) {
    for (let catalogNumber in myCourses[subject]) {
      // Skip course if already fulfilled
      if (myCourses[subject][catalogNumber]) continue;
      taken.push({ subject, catalogNumber });
      numTaken++;
      if (numTaken >= limit) return taken;
    }
  }
  return taken;
}

export default class AnyCheck extends Component {
  static propTypes = {
    choose: PropTypes.number.isRequired,
    myCourses: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
  };

  state = {
    taken: false,
    isChecked: false,
    children: [],
  };

  componentDidMount() {
    const { choose, myCourses } = this.props;
    const children = Array.from(Array(choose).keys()).map(() =>
      ({ subject: '', catalogNumber: '', checked: false, taken: false }));
    this.setState({ children });
    this.checkTaken(myCourses);
  }

  checkTaken = (myCourses) => {
    const takenCourses = getTakenCourses(myCourses, this.props.choose);
    if (takenCourses.length === 0) return;

    // If course is taken, increment count by 1
    if (this.props.choose === 1) {
      this.props.onCheck(null, true);
      this.setState({ taken: true, isChecked: true });
    } else {
      const { children } = this.state;
      this.props.onCheck(null, true, takenCourses.length);
      takenCourses.forEach(({ subject, catalogNumber }, index) => {
        children[index] = { subject, catalogNumber, checked: true, taken: true };
      });
      this.setState({ children });
    }
  }

  onCheck = (index, isChecked) => {
    // Toggle main checkbox
    if (index === -1) {
      this.setState({ isChecked });
    } else {
      const { children } = this.state;
      children[index].checked = isChecked;
      this.setState({ children });
      this.props.onCheck(null, isChecked);
    }
  }

  render() {
    const { choose } = this.props;

    return (
      <div>
        <Checkbox
          label="Any course"
          checked={ this.state.isChecked }
          onCheck={ (_, isChecked) => this.onCheck(-1, isChecked) }
          iconStyle={ styles.iconStyle }
          labelStyle={ styles.labelStyle(this.state.taken) }
          style={ styles.checkbox }
          disabled={ choose > 1 }
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

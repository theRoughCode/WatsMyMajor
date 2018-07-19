import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  iconStyle: {
    left: 0,
  },
  labelStyle: {
    width: '100%',
    color: 'inherit'
  },
  checkbox: {
    marginTop: 10,
    width: 'auto',
    marginLeft: 20,
    textAlign: 'left',
  },
  indentedChecks: {
    marginTop: 0,
    marginLeft: 50,
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

const getTakenCoursesInLevel = (subject, level, excluding, myCourses) => {
  if (myCourses[subject] == null) return [];
  const levelNum = Number(level.trim().charAt(0));
  if (isNaN(levelNum)) {
		console.error(`Level: ${levelNum} is not a number!`);
		return [];
	}

  const catNums = Object.keys(myCourses[subject]);
  return catNums.filter((catNum) => {
		const catLevel = Number(catNum.trim().charAt(0));
		if (isNaN(catLevel)) {
			console.error(`Catalog number ${catLevel} (${catNum}) is not a number!`);
			return false;
		}
    if (catLevel !== levelNum) return false;
		// Check if course is in exclude list
		for (let i = 0; i < excluding.length; i++) {
			if (catNum === excluding[i]) return false;
		}
		return true;
	});
}

export default class LevelCheck extends Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    choose: PropTypes.number.isRequired,
    excluding: PropTypes.array,
    myCourses: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
  };

  static defaultProps = {
    excluding: [],
  };

  state = {
    taken: false,
    isChecked: false,
    children: [],
  }

  componentDidMount() {
    const { subject, level, excluding, myCourses, choose } = this.props;
    const children = Array.from(Array(choose).keys()).map(() =>
      ({ subject: '', catalogNumber: '', checked: false}));
    this.setState({ children });
    this.checkTaken(subject, level, excluding, children, myCourses);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, from, to, excluding, myCourses } = nextProps;
    if (subject !== this.props.subject
      || from !== this.props.from
      || to !== this.props.to) {
      this.checkTaken(subject, from, to, excluding, this.state.children, myCourses);
    }
  }

  checkTaken = (subject, level, excluding, children, myCourses) => {
    const takenCourses = getTakenCoursesInLevel(subject, level, excluding, myCourses);
    if (takenCourses.length === 0) return;

    // If course is taken, increment count by 1
    if (this.props.choose === 1) {
      this.props.onCheck(null, true);
      this.setState({ taken: true, isChecked: true });
    } else {
      this.props.onCheck(null, true, takenCourses.length);
      takenCourses.forEach((catalogNumber, index) => {
        children[index] = { subject, catalogNumber, checked: true };
      });
      this.setState({ children });
    }
  }

  onCheck = (index, ev, isChecked) => {
    // Toggle main checkbox
    if (index === -1) {
      this.setState({ isChecked });
    } else {
      const { children } = this.state;
      children[index].checked = isChecked;
      this.setState({ children });
      this.props.onCheck(ev, isChecked);
    }
  }

  render() {
    const { subject, level, excluding, choose } = this.props;
    const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
    return (
      <div>
        <Checkbox
          label={ `${subject} ${level} - level${excludingStr}` }
          checked={ this.state.isChecked }
          onCheck={ this.onCheck.bind(this, -1) }
          labelStyle={ styles.labelStyle }
          iconStyle={ styles.iconStyle }
          style={ styles.checkbox }
          disabled={ choose > 1 || this.state.taken }
        />
        { (choose > 1) && (
          <div style={ styles.indentedChecks }>
            { Array.from(Array(choose).keys()).map((_, index) => {
              const child = this.state.children[index];
              const label = (child) ? `${child.subject} ${child.catalogNumber}` : '';
              const checked = (child) ? child.checked : false;
              return (
                <Checkbox
                  key={ index }
                  label={ label }
                  checked={ checked }
                  onCheck={ this.onCheck.bind(this, index) }
                  labelStyle={ styles.labelStyle }
                  iconStyle={ styles.innerIcon }
                  style={ styles.innerChecks }
                />
              );
            }) }
          </div>
        ) }
      </div>
    );
  }
}

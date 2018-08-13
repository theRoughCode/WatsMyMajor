import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
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

// List of math subjects
const coreSubjects = {
  'math': ['ACTSC', 'AMATH', 'CO', 'COMM', 'CS', 'MATH', 'MATBUS',
            'MTHEL', 'PMATH', 'SE', 'STAT'],
};

const getSubjectCourses = (subject, excluding, myCourses) => {
  // If a core subject (i.e. math)
  if (coreSubjects.hasOwnProperty(subject)) {
    // List of subjects
    const subjects = coreSubjects[subject].filter(s => !excluding.includes(s));
    return subjects.map(s =>
      (myCourses.hasOwnProperty(s))
        ? ({ subject: s, catNums: Object.keys(myCourses[s]) })
        : null
      ).filter(c => c != null);
  }
  if (!myCourses.hasOwnProperty(subject)) return [];

  // Regular subject (i.e. PMATH, MATH, CS)
  return [{ subject, catNums: Object.keys(myCourses[subject]) }];
}

const getTakenCourses = (subject, level, excluding, myCourses) => {
  const subjectCourses = getSubjectCourses(subject, excluding, myCourses);
  if (subjectCourses.length === 0) return [];

  const takenCourses = [];
  subjectCourses.forEach(({ subject, catNums }) => {
    catNums.forEach(catNum => takenCourses.push({ subject, catalogNumber: catNum }));
  });
  // Just check subject
  if (level.length === 0) return takenCourses;

  // Check level
  level = level.trim();
  const levelNum = Number(level.charAt(0));
  if (isNaN(levelNum)) {
		console.error(`Level: ${levelNum} is not a number!`);
		return [];
	}
  const isPlus = level.charAt(level.length - 1) === '+';

  // Filter out courses that aren't the right level or is in the exclusion list
  return takenCourses.filter(({ catalogNumber }) => {
    const catLevel = Number(catalogNumber.trim().charAt(0));
    if (isNaN(catLevel)) {
      console.error(`Catalog number ${catLevel} (${catalogNumber}) is not a number!`);
      return false;
    }
    // If its lower than required level, we don't want it
    if (catLevel < levelNum) return false;
    // If it's not a xxx+ level course and the level is higher than the
    // required level, we don't want it
    if (!isPlus && catLevel > levelNum) return false;
    return (catLevel >= levelNum) && !excluding.includes(catalogNumber);
  });
}

export default class LevelCheck extends Component {
  static propTypes = {
    subject: PropTypes.string.isRequired,
    level: PropTypes.string,
    excluding: PropTypes.array,
    choose: PropTypes.number.isRequired,
    note: PropTypes.string,
    myCourses: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
  };

  static defaultProps = {
    level: '',
    excluding: [],
    note: '',
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
    const { subject, level, excluding, myCourses } = nextProps;
    if (subject !== this.props.subject || level !== this.props.level) {
      this.checkTaken(subject, level, excluding, this.state.children, myCourses);
    }
  }

  checkTaken = (subject, level, excluding, children, myCourses) => {
    let takenCourses = getTakenCourses(subject, level, excluding, myCourses);
    if (takenCourses.length === 0) return;

    // If course is taken, increment count by 1
    if (this.props.choose === 1) {
      this.props.onCheck(null, true);
      this.setState({ taken: true, isChecked: true });
    } else {
      takenCourses = takenCourses.slice(0, this.props.choose);
      this.props.onCheck(null, true, takenCourses.length);
      takenCourses.forEach(({ subject, catalogNumber }, index) => {
        children[index] = { subject, catalogNumber, checked: true };
      });
      this.setState({ children });
    }
  }

  onCheck = (index, ev, isChecked) => {
    // Toggle main checkbox
    if (index === -1) {
      this.setState({ isChecked });
      if (this.state.children.length > 0) this.props.onCheck(null, isChecked);
    } else {
      const { children } = this.state;
      children[index].checked = isChecked;
      this.setState({ children });
      this.props.onCheck(null, isChecked);
    }
  }

  render() {
    const { subject, level, excluding, choose, note } = this.props;
    const levelStr = (level.length > 0) ? `${level}-level ` : '';
    const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
    return (
      <div data-tip data-for='note'>
        <Checkbox
          label={ `Any ${levelStr}${subject} course${excludingStr}` }
          checked={ this.state.isChecked }
          onCheck={ this.onCheck.bind(this, -1) }
          labelStyle={ styles.labelStyle }
          iconStyle={ styles.iconStyle }
          style={ styles.checkbox }
          disabled={ choose > 1 || this.state.taken }
        />
        { (choose > 1) && (
          <div style={ styles.indentedChecks }>
            {
              this.state.children.map(({ subject, catalogNumber, checked }, index) => {
                const label = (subject.length > 0) ? `${subject} ${catalogNumber}` : '';
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
              })
            }
          </div>
        ) }
        {
          (note.length > 0) && (
            <ReactTooltip id='note' type='info' effect='solid'>
              <span>{ note }</span>
            </ReactTooltip>
          )
        }
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
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
  },
  note: {
    display: 'flex',
    textAlign: 'left',
    maxWidth: 280,
    whiteSpace: "pre-wrap",
    wordWrap: "break-all",
  }
};

// List of math subjects
const coreSubjects = {
  'math': {
    subjects: ['ACTSC', 'AMATH', 'CO', 'COMM', 'CS', 'MATH', 'MATBUS',
      'MTHEL', 'PMATH', 'SE', 'STAT'],
    name: 'math',
  },
  'science': {
    subjects: ['AVIA', 'BIOL', 'CHEM', 'SCCOM', 'EARTH', 'MNS', 'OPTOM',
      'PDPHRM', 'PHARM', 'PHYS', 'SCI', 'SCBUS'],
    name: 'science',
  },
  'language': {
    subjects: ['ASL', 'CHINA', 'CROAT', 'DUTCH', 'ENGL', 'EMLS', 'FR', 'GER',
      'GRK', 'ITAL', 'JAPAN', 'KOREA', 'LAT', 'PORT', 'RUSS', 'SI', 'SPAN'],
    name: 'language',
  },
  'language2': {
    subjects: ['CHINA', 'CROAT', 'DUTCH', 'FR', 'GER', 'GRK', 'ITAL',
      'JAPAN', 'KOREA', 'LAT', 'PORT', 'RUSS', 'SI', 'SPAN'],
    name: 'language',
  },
};

const getSubjectCourses = (subject, excluding, myCourses) => {
  // If a core subject (i.e. math)
  if (coreSubjects.hasOwnProperty(subject)) {
    // List of subjects
    const subjects = coreSubjects[subject].subjects.filter(s => !excluding.includes(s));
    return subjects.map(s =>
      (myCourses.hasOwnProperty(s))
        ? ({ subject: s, catNums: Object.keys(myCourses[s]) })
        : null
    ).filter(c => c != null);
  }
  if (!myCourses.hasOwnProperty(subject)) return [];

  // Regular subject (i.e. PMATH, MATH, CS)
  let catNums = Object.keys(myCourses[subject]);
  if (excluding.length > 0) catNums = catNums.filter(n => !excluding.includes(n));
  return [{ subject, catNums }];
}

const getTakenCourses = (subject, level, excluding, myCourses) => {
  const subjectCourses = getSubjectCourses(subject, excluding, myCourses);
  if (subjectCourses.length === 0) return [];

  const takenCourses = [];
  subjectCourses.forEach(({ subject, catNums }) => {
    catNums.forEach(catNum => {
      // Skip if course has already fulfilled another requirement
      if (myCourses[subject][catNum]) return;
      takenCourses.push({ subject, catalogNumber: catNum });
    });
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
  return takenCourses.filter(({ subject, catalogNumber }) => {
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
      ({ subject: '', catalogNumber: '', checked: false, taken: false }));
    this.setState({ children });
    this.checkTaken(subject, level, excluding, children, myCourses);
  }

  componentWillReceiveProps(nextProps) {
    const { subject, level, excluding, myCourses } = nextProps;
    if (subject !== this.props.subject || level !== this.props.level) {
      this.checkTaken(subject, level, excluding, this.state.children, myCourses);
    }
  }

  // Mark courses as "taken" or fulfilled by this requirement
  markTaken = (courses) => courses.forEach(({ subject, catalogNumber }) =>
    this.props.myCourses[subject][catalogNumber] = true
  );

  checkTaken = (subject, level, excluding, children, myCourses) => {
    let takenCourses = getTakenCourses(subject, level, excluding, myCourses);
    if (takenCourses.length === 0) return;

    // If course is taken, increment count by 1
    if (this.props.choose <= 1) {
      this.props.onCheck(null, true);
      this.setState({ taken: true, isChecked: true });
      this.markTaken(takenCourses.slice(0, 1));
    } else {
      takenCourses = takenCourses.slice(0, this.props.choose);
      this.props.onCheck(null, true, takenCourses.length);
      takenCourses.forEach(({ subject, catalogNumber }, index) => {
        children[index] = { subject, catalogNumber, checked: true, taken: true };
      });
      this.setState({ children });
      this.markTaken(takenCourses);
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
    const { subject, level, excluding, choose, note } = this.props;
    const levelStr = (level.length > 0) ? `${level}-level ` : '';
    const excludingStr = (excluding.length > 0) ? ` (excl. ${excluding.join(',')})` : '';
    // language2 is not a suitable display name
    const subjectName = (coreSubjects.hasOwnProperty(subject))
      ? coreSubjects[subject].name
      : subject;
    return (
      <div data-tip data-for={ `note-${subject}-${level}-${choose}` }>
        <Checkbox
          label={ `Any ${levelStr}${subjectName} course${excludingStr}` }
          checked={ this.state.isChecked }
          onCheck={ (_, isChecked) => this.onCheck(-1, isChecked) }
          labelStyle={ styles.labelStyle(this.state.taken) }
          iconStyle={ styles.iconStyle }
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
        {
          (note.length > 0) && (
            <ReactTooltip
              id={ `note-${subject}-${level}-${choose}` }
              type='info'
              effect='solid'
            >
              <span style={ styles.note }>{ note }</span>
            </ReactTooltip>
          )
        }
      </div>
    );
  }
}

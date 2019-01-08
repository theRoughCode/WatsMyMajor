import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DateIcon from 'material-ui/svg-icons/editor/insert-invitation';
import LeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import DayIcon from 'material-ui/svg-icons/action/view-day';
import MultipleDaysIcon from 'material-ui/svg-icons/action/view-week';
import PublishIcon from 'material-ui/svg-icons/editor/publish';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DotsIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Calendar, Event } from './calendar';
import { addDays, diffDays, startOfDay } from './calendar/dateUtils';
import { objectEquals } from 'utils/arrays';
import { red, green2, blueGreen, mediumBlue } from 'constants/Colours';

const referenceDate = new Date(2017, 1, 1);

const modeNbOfDaysMap = {
  day: 1,
  '3days': 3,
  week: 7
}

const styles = {
  iconContainer: {
    marginTop: 2,
    marginRight: 20
  },
  viewButton: {
    minWidth: 40,
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: 11,
    marginLeft: 10
  },
  viewLabel: {
    paddingRight: 0,
  },
  downIcon: {
    verticalAlign: 'top',
    marginTop: 5,
  },
  dateIcon: {
    borderRadius: 40,
    minWidth: 40,
    height: 40,
    lineHeight: 0,
    margin: 10
  },
  today: {
    minWidth: 40,
    display: 'inline-block',
    verticalAlign: 'top',
    lineHeight: 0,
    marginTop: 11,
    marginRight: 10
  },
  arrows: {
    borderRadius: 20,
    height: 'auto',
    minWidth: 0,
    lineHeight: 0
  },
  button: {
    margin: 'auto 10px',
    marginTop: 5,
  },
  check: (isMobile) => ({
    margin: (isMobile) ? 10 : 'auto',
    marginLeft: (isMobile) ? 16 : 'auto',
    marginRight: (isMobile) ? 'auto' : 10,
    width: 'fit-content',
  }),
  name: {
    margin: 'auto',
    marginRight: 10,
    fontSize: 16,
    width: 170,
  },
};


// Types of calendar events
const USER = 0;
const FRIEND = 1;
const SHARED = 2;

const parseCourses = (courses, isFriends) => {
  const classesArr = [];

  courses.forEach(({ subject, catalogNumber, classes }) => {
    if (!classes) return;
    Object.entries(classes).forEach(arr => {
      const classType = arr[0];

      const {
        classNum,
        section,
        days,
        startTime,
        endTime,
        location,
        instructor,
        startDate,
        endDate,
        type
      } = arr[1];

      let colour = mediumBlue;
      if (isFriends || type === FRIEND) colour = green2;
      else if (type === SHARED) colour = blueGreen;

      const startDateMoment = moment({
        year: startDate.year,
        month: startDate.month - 1,  // months are zero indexed
        date: startDate.day
      });
      const endDateMoment = moment({
        year: endDate.year,
        month: endDate.month - 1,
        date: endDate.day
      });
      let date = startDateMoment;

      /* eslint-disable no-loop-func */
      while (date.isSameOrBefore(endDateMoment)) {
        days.forEach(dayStr => {
          let day = 0;
          switch (dayStr) {
          case 'M': day = 1; break;
          case 'T': day = 2; break;
          case 'W': day = 3; break;
          case 'Th': day = 4; break;
          case 'F': day = 5; break;
          default: day = 6;
          }

          // ensure valid date
          const startOfWeekMoment = date.startOf('week');
          const currDayMoment = startOfWeekMoment.add(day, 'days');
          if (currDayMoment.isSameOrAfter(startDateMoment) || currDayMoment.add(day, 'days').isSameOrBefore(endDateMoment)) {
            const start = new Date(date.year(), date.month(), currDayMoment.date(), startTime.hour, startTime.min);
            const end = new Date(date.year(), date.month(), currDayMoment.date(), endTime.hour, endTime.min);

            classesArr.push({
              subject,
              catalogNumber,
              type: classType,
              colour,
              classNum,
              section,
              days,
              start,
              end,
              location,
              instructor
            });
          }
        });
        date = date.add(7, 'days');
      }
    });
  });

  return classesArr;
}

const parseSchedule = (schedule, isFriends = false) => {
  const classes = [];

  const terms = Object.keys(schedule);
  terms.forEach(term => {
    const courses = schedule[term];
    const parsedCourses = parseCourses(courses, isFriends);
    classes.push(...parsedCourses);
  });
  return classes;
};

// Combines user schedule with friend's and classifies them as either just
// user's, just friend's, or shared course
const combineSchedules = (schedule, friendSchedule) => {
  if (Object.keys(friendSchedule).length === 0) return {};
  const mergedSchedule = Object.assign({}, friendSchedule);

  // Init all friend's classes as just friend's
  for (let term in mergedSchedule) {
    mergedSchedule[term].forEach(course => {
      for (let classType in course.classes) {
        course.classes[classType].type = FRIEND;
      }
    });
  }


  for (let term in schedule) {
    // User and friend shares terms
    if (mergedSchedule.hasOwnProperty(term)) {
      schedule[term].forEach(course => {
        const newCourse = Object.assign({}, course);
        for (let classType in course.classes) {
          const userClassNum = course.classes[classType].classNum;
          let sharedCourseIndex = -1;
          for (let i = 0; i < mergedSchedule[term].length; i++) {
            const { subject, catalogNumber } = mergedSchedule[term][i];

            // User and friend shares a course
            if (subject === course.subject && catalogNumber === course.catalogNumber) {
              sharedCourseIndex = i;
              break;
            }
          }
          if (sharedCourseIndex > -1) {
            const friendClass = mergedSchedule[term][sharedCourseIndex].classes[classType];
            // If user and friend shares a class, we merge them by labelling as shared
            if (userClassNum === friendClass.classNum) {
              mergedSchedule[term][sharedCourseIndex].classes[classType].type = SHARED;
              delete newCourse.classes[classType];
            }
          }
        }

        // If there are classes for this course that the user does not share with friend,
        // we label as user's
        if (newCourse.classes != null && Object.keys(newCourse.classes).length > 0) {
          for (let classType in newCourse.classes) {
            newCourse.classes[classType].type = USER;
          }
          mergedSchedule[term].push(newCourse);
        }
      });
    } else {
      // User and friend do not share the same term
      // Init all user's classes as user's
      mergedSchedule[term] = schedule[term].map(course => {
        for (let classType in course.classes) {
          course.classes[classType].type = USER;
        }
        return course;
      });
    }
  }
  return mergedSchedule;
}

export default class CalendarContainer extends Component {
  static propTypes = {
    onClassClick: PropTypes.func.isRequired,
    onClearSchedule: PropTypes.func.isRequired,
    onImportTerm: PropTypes.func.isRequired,
    onUpdatePrivacy: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    term: PropTypes.string.isRequired,
    friendSchedule: PropTypes.object.isRequired,
    friendName: PropTypes.string.isRequired,
    isBrowsing: PropTypes.bool.isRequired,
    isPublic: PropTypes.bool.isRequired,
  };

  state = {
    date: new Date(),
    mode: '3days',
    classes: parseSchedule(this.props.schedule),
    combinedClasses: parseSchedule(combineSchedules(this.props.schedule, this.props.friendSchedule)),
    isMenuOpen: false,
    anchorEl: null,
    view: '3 Days',
  };

  componentDidMount() {
    this.updateTerm(this.props.term);
  }

  componentWillReceiveProps = (nextProps) => {
    if (!objectEquals(nextProps.schedule, this.props.schedule)) {
      const classes = parseSchedule(nextProps.schedule);
      this.setState({ classes });
    }

    if (nextProps.term !== this.props.term) this.updateTerm(nextProps.term);
  }

  updateTerm = (termStr) => {
    if (termStr == null || termStr.length !== 4) return;

    const year = Number('20' + termStr.slice(1, 3));
    if (isNaN(year)) return;
    const month = Number(termStr.slice(3)) - 1;
    if (isNaN(month)) return;
    const date = new Date(year, month, 7);
    this.setDate(date);
  }

  setDate = (date) =>  this.setState({ date });

  onChangeIndex = (index) => {
    const date = addDays(referenceDate, index * modeNbOfDaysMap[this.getMode()]);
    this.unControlledDate = date;
    this.setDate(date);
  }

  getMode = () => this.state.mode == null ? 'day' : this.state.mode;

  changeMode = (mode) => {
    let view = '3 Days';
    switch (mode) {
    case 'day':
      view = 'Day';
      break;
    case 'week':
      view = 'Week';
      break;
    default:
      view = '3 Days';
    }
    this.setState({ mode: mode, isMenuOpen: false, view });
  }

  getDate = () => this.state.date != null ? this.state.date : this.unControlledDate;

  getIndex = () => Math.floor(diffDays(startOfDay(this.getDate()), referenceDate) / modeNbOfDaysMap[this.getMode()]);

  openMenu = (ev) => {
    ev.preventDefault();
    this.setState({ isMenuOpen: !this.state.isMenuOpen, anchorEl: ev.currentTarget });
  }

  closeMenu = () => this.setState({ isMenuOpen: false });

  openDatePicker = () => this.refs.dp.openDialog();

  render() {
    const classes = (!this.props.isBrowsing)
      ? this.state.classes
      : this.state.combinedClasses;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppBar
          style={{ background: 'white', position: 'relative', zIndex: 900 }}
          titleStyle={{
            color: 'black',
            textAlign: 'left',
            marginBottom: 10
          }}
          title={
            <MediaQuery minWidth={ 427 }>
              { matches => (matches || !this.props.isBrowsing || !this.props.friendName.length)
                ? `${moment(this.state.date).format('MMM YYYY')}`
                : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ lineHeight: 1.6 }}>{ `${moment(this.state.date).format('MMM YYYY')}` }</span>
                    <span style={{ fontSize: 17, lineHeight: 1, fontWeight: 300 }}>{ `${this.props.friendName}'s Schedule` }</span>
                  </div>
                )
              }
            </MediaQuery>
          }
          iconStyleLeft={ styles.iconContainer }
          iconElementLeft={
            <div>
              <MediaQuery minWidth={ 978 }>
                <FlatButton
                  onClick={ this.openMenu }
                  label={ this.state.view }
                  labelPosition="before"
                  labelStyle={ styles.viewLabel }
                  backgroundColor="rgba(0,0,0,0.04)"
                  icon={ <DownIcon style={ styles.downIcon } /> }
                  style={ styles.viewButton }
                />
                <Popover
                  open={ this.state.isMenuOpen }
                  anchorEl={ this.state.anchorEl }
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={ this.closeMenu }
                  animation={ PopoverAnimationVertical }
                >
                  <Menu>
                    <MenuItem leftIcon={ <DayIcon /> } onClick={ () => this.changeMode('day') }>Day</MenuItem>
                    <MenuItem leftIcon={ <MultipleDaysIcon /> } onClick={ () => this.changeMode('3days') }>3 Days</MenuItem>
                    <MenuItem leftIcon={ <MultipleDaysIcon /> } onClick={ () => this.changeMode('week') }>Week</MenuItem>
                  </Menu>
                </Popover>
                <FlatButton
                  style={ styles.dateIcon }
                  onClick={ this.openDatePicker }
                >
                  <DateIcon color='grey' />
                </FlatButton>
                <FlatButton
                  label="Today"
                  style={ styles.today }
                  labelStyle={ styles.todayLabel }
                  backgroundColor="rgba(0,0,0,0.04)"
                  onClick={ () => this.setDate(new Date()) }
                />
                <FlatButton
                  style={ styles.arrows }
                  onClick={ () => this.onChangeIndex(this.getIndex() - 1) }
                >
                  <LeftIcon color='grey' style={{ margin: 'auto' }} />
                </FlatButton>
                <FlatButton
                  style={ styles.arrows }
                  onClick={ () => this.onChangeIndex(this.getIndex() + 1) }
                >
                  <RightIcon color='grey' style={{ margin: 'auto' }} />
                </FlatButton>
              </MediaQuery>
            </div>
          }
          iconElementRight={
            <div style={{ display: 'flex', height: '100%', marginTop: -8 }}>
              { (this.props.isBrowsing)
                ? (
                  <MediaQuery minWidth={ 427 }>
                    {
                      this.props.friendName.length > 0 && (
                        <span style={ styles.name }>{ `${this.props.friendName}'s Schedule` }</span>
                      )
                    }
                  </MediaQuery>
                )
                : (
                  <MediaQuery minWidth={ 978 }>
                    <Checkbox
                      label="Public"
                      checked={ this.props.isPublic }
                      onCheck={ this.props.onUpdatePrivacy }
                      style={ styles.check(false) }
                      iconStyle={{ left: 0, marginRight: 5 }}
                    />
                    <RaisedButton
                      label="Import"
                      labelPosition="before"
                      primary
                      onClick={ this.props.onImportTerm }
                      icon={ <PublishIcon /> }
                      style={ styles.button }
                    />
                    <RaisedButton
                      label="Clear"
                      labelPosition="before"
                      backgroundColor={ red }
                      onClick={ this.props.onClearSchedule }
                      icon={ <ClearIcon /> }
                      style={ styles.button }
                    />
                  </MediaQuery>
                )
              }
              <MediaQuery maxWidth={ 977 }>
                <IconButton onClick={ this.openDatePicker } style={{ margin: 'auto' }}>
                  <DateIcon />
                </IconButton>
                <IconButton onClick={ this.openMenu } style={{ margin: 'auto' }}>
                  <DotsIcon />
                </IconButton>
                <Popover
                  open={ this.state.isMenuOpen }
                  anchorEl={ this.state.anchorEl }
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={ this.closeMenu }
                  animation={ PopoverAnimationVertical }
                >
                  <Menu>
                    <MenuItem leftIcon={ <DayIcon /> } onClick={ () => this.changeMode('day') }>Day</MenuItem>
                    <MenuItem leftIcon={ <MultipleDaysIcon /> } onClick={ () => this.changeMode('3days') }>3 Days</MenuItem>
                    <MenuItem leftIcon={ <MultipleDaysIcon /> } onClick={ () => this.changeMode('week') }>Week</MenuItem>
                    { !this.props.isBrowsing && (
                      <div>
                        <Divider />
                        <Checkbox
                          label="Public"
                          checked={ this.props.isPublic }
                          onCheck={ this.props.onUpdatePrivacy }
                          style={ styles.check(true) }
                          iconStyle={{ left: 0, marginRight: 5 }}
                        />
                        <MenuItem onClick={ this.props.onImportTerm }>Import Term</MenuItem>
                        <MenuItem onClick={ this.props.onClearSchedule }>Clear Schedule</MenuItem>
                      </div>
                    ) }
                  </Menu>
                </Popover>
              </MediaQuery>
            </div>
          }
        />
        <DatePicker
          ref="dp"
          name="dp"
          style={{ display: 'none' }}
          onChange={ (_, date) => this.setDate(date) }
          value={ this.state.date }
        />
        <Calendar
          style={{ height: '100%', width: '100%' }}
          date={ this.state.date }
          referenceDate={ referenceDate }
          mode={ this.state.mode }
          getIndex={ this.getIndex }
        >
          {
            classes
              .map((classElem, index) => (
                <Event
                  key={ index }
                  background={ classElem.colour }
                  title={ `${classElem.subject} ${classElem.catalogNumber}` }
                  onClick={ () => this.props.onClassClick(classElem.subject, classElem.catalogNumber) }
                  { ...classElem }
                />
              ))
          }
        </Calendar>
      </div>
    )
  }
}

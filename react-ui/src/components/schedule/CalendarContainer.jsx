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
import RandomColour from 'randomcolor';
import { Calendar, Event } from './calendar';
import { addDays, diffDays, startOfDay } from './calendar/dateUtils';
import { objectEquals } from '../../utils/arrays';
import { red } from '../../constants/Colours';

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
  }
};

const parseCourses = (courses) => {
  const classesArr = [];

  courses.forEach(({ subject, catalogNumber, classes }) => {
    if (!classes) return;
    const colour = RandomColour({ luminosity: 'dark' });
    Object.entries(classes).forEach(arr => {
      const type = arr[0];

      const {
        classNum,
        section,
        days,
        startTime,
        endTime,
        location,
        instructor,
        startDate,
        endDate
      } = arr[1];

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
              type,
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

const parseSchedule = (schedule) => {
  const classes = [];

  const terms = Object.keys(schedule);
  terms.forEach(term => {
    const courses = schedule[term];
    const parsedCourses = parseCourses(courses);
    classes.push(...parsedCourses);
  });
  return classes;
};

export default class CalendarContainer extends Component {
  static propTypes = {
    onClassClick: PropTypes.func.isRequired,
    onClearSchedule: PropTypes.func.isRequired,
    onImportTerm: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const date = new Date();

    this.state = {
      date: date,
      mode: '3days',
      classes: parseSchedule(props.schedule),
      isMenuOpen: false,
      anchorEl: null,
      view: '3 Days',
    };

    this.setDate = this.setDate.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openDatePicker = this.openDatePicker.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!objectEquals(nextProps.schedule, this.props.schedule)) {
      const classes = parseSchedule(nextProps.schedule);
      this.setState({ classes });
    }
  }

  setDate(date) {
    this.setState({ date });
  }

  onChangeIndex(index) {
    const date = addDays(referenceDate, index * modeNbOfDaysMap[this.getMode()]);
    this.unControlledDate = date;
    this.setDate(date);
  }

  getMode() {
    return this.state.mode == null ? 'day' : this.state.mode;
  }

  changeMode(mode) {
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

  getDate() {
    return this.state.date != null ? this.state.date : this.unControlledDate;
  }

  getIndex() {
    return Math.floor(diffDays(startOfDay(this.getDate()), referenceDate) / modeNbOfDaysMap[this.getMode()]);
  }

  openMenu(ev) {
    ev.preventDefault();
    this.setState({ isMenuOpen: !this.state.isMenuOpen, anchorEl: ev.currentTarget });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  openDatePicker() {
    this.refs.dp.openDialog();
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppBar
          style={{ background: 'white', position: 'relative', zIndex: 900 }}
          titleStyle={{
            color: 'black',
            textAlign: 'left',
            marginBottom: 10
          }}
          title={ `${moment(this.state.date).format('MMM YYYY')}` }
          iconStyleLeft={ styles.iconContainer }
          iconElementLeft={
            <div>
              <MediaQuery minWidth={ 802 }>
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
            <div>
              <MediaQuery minWidth={ 802 }>
                <RaisedButton
                  label="Import Term"
                  labelPosition="before"
                  primary
                  onClick={ this.props.onImportTerm }
                  icon={ <PublishIcon /> }
                  style={ styles.button }
                />
                <RaisedButton
                  label="Clear Schedule"
                  labelPosition="before"
                  backgroundColor={ red }
                  onClick={ this.props.onClearSchedule }
                  icon={ <ClearIcon /> }
                  style={ styles.button }
                />
              </MediaQuery>
              <MediaQuery maxWidth={ 801 }>
                <IconButton onClick={ this.openDatePicker }>
                  <DateIcon />
                </IconButton>
                <IconButton onClick={ this.openMenu }>
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
                    <Divider />
                    <MenuItem onClick={ this.props.onImportTerm }>Import Term</MenuItem>
                    <MenuItem onClick={ this.props.onClearSchedule }>Clear Schedule</MenuItem>
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
            this.state.classes
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

// @flow

import React, { Component } from 'react';
import { Calendar, Event } from './calendar';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import DayIcon from 'material-ui/svg-icons/action/view-day';
import MultipleDaysIcon from 'material-ui/svg-icons/action/view-week';

var color1 = '#049BE5';
var color2 = '#33B679';
var color3 = '#E67B73';

function startOfDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addTime(date, hours, minutes) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes == null ? 0 : minutes);
}

function getIcon(mode) {
  switch(mode) {
    case 'day':
      return <DayIcon/>;
    case '3days':
    case 'week':
      return <MultipleDaysIcon/>;
  }
}

class CalendarContainer extends Component {

  constructor(props: any) {
    super(props);

    const date = startOfDay(new Date());
    this.state = {
      term: 'Spring 2018',
      date: date,
      mode: 'day',
      isOpen: false,
      classes: [{
        key: 0,
        start: addTime(date, 10),
        end: addTime(date, 11),
        background: color1,
        title: 'Team meeting'
      }, {
        key: 1,
        start: addTime(date, 34),
        end: addTime(date, 35),
        background: color1,
        title: 'Team meeting'
      }, {
        key: 2,
        start: addTime(date, 58),
        end: addTime(date, 59),
        background: color1,
        title: 'Team meeting'
      }, {
        key: 3,
        start: addTime(date, -14),
        end: addTime(date, -13),
        background: color1,
        title: 'Team meeting'
      }, {
        key: 4,
        start: addTime(date, 12),
        end: addTime(date, 14),
        background: color2,
        title: 'Picnic with Marion'
      }, {
        key: 5,
        start: addTime(date, 16),
        end: addTime(date, 17),
        background: color3,
        title: 'Walk Ginza'
      }, {
        key: 6,
        start: addTime(date, 16, 45),
        end: addTime(date, 17, 15),
        background: color2,
        title: 'Meet William'
      }, {
        key: 7,
        start: addTime(date, 64, 45),
        end: addTime(date, 65, 15),
        background: color2,
        title: 'Meet Olivier'
      }, {
        key: 8,
        start: addTime(date, 37, 30),
        end: addTime(date, 38, 30),
        background: color3,
        title: 'Haircut'
      }, {
        key: 9,
        start: addTime(date, 39),
        end: addTime(date, 42),
        background: color1,
        title: 'Photo shoot'
      }]
    };

		this.setDate = this.setDate.bind(this);
		this.changeMode = this.changeMode.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
  }

  setDate(date) {
    this.setState({ date: date });
  }

  changeMode(mode) {
    this.setState({ mode: mode, isOpen: false});
  }

  toggleMenu() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Drawer
          docked={false}
          open={this.state.isOpen}
          onRequestChange={this.toggleMenu}>
          <MenuItem leftIcon={<DayIcon/>} onClick={() => this.changeMode('day')}>Day</MenuItem>
          <MenuItem leftIcon={<MultipleDaysIcon/>} onClick={() => this.changeMode('3days')}>3 Days</MenuItem>
          <MenuItem leftIcon={<MultipleDaysIcon/>} onClick={() => this.changeMode('week')}>Week</MenuItem>
        </Drawer>
        <AppBar
          style={{ background: 'white', position: 'relative' }}
          titleStyle={{ color: 'black' }}
          title={ this.state.term }
          iconElementLeft={<IconButton onClick={this.toggleMenu}><MenuIcon color='black' /></IconButton>}
        />
        <Calendar
          style={{ height: '100%', width: '100%' }}
          date={this.state.date}
          onDateChange={this.setDate}
          mode={this.state.mode}>
          {
            this.state.classes
              .map(event => (
              <Event
                key={event.key}
                start={event.start}
                end={event.end}
                background={event.background}
                title={event.title}
              />
            ))
          }
        </Calendar>
      </div>
    );
  }
}

export default CalendarContainer;
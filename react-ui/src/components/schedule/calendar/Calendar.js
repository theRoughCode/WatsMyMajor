// @flow
import type { EventElement } from './types';

import React, { Component } from 'react';

import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';

import DayView from './DayView';
import MultipleDaysView from './MultipleDaysView';
import { addDays, diffDays, startOfDay } from './dateUtils';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

function getEventsFromChildren(children?: EventElement | EventElement[]) {
	if(children == null) {
		return [];
	} else if (!Array.isArray(children)) {
		return [children];
	} else {
		return children;
	}
}

const referenceDate = new Date(2017,1,1);

type Props = {
	date?: Date,
	onDateChange?: (date: Date) => void,
	mode?: 'day' | '3days' | 'week',
	onCreateEvent?: (start: Date, end: Date) => void,
	children?: EventElement | EventElement[],
	style?: any
}

type State = {
	scrollPosition: number,
	isSwiping: boolean,
	newEvent: ?{
		start: Date,
		end: Date
	}
}

var modeNbOfDaysMap = {
	day: 1,
	'3days': 3,
	week: 7
}

function getTimeOrDefault(date: ?Date): number {
	return date == null ? 0 : date.getTime();
}

class Calendar extends Component {
	props: Props;
	static propTypes = {
		date: React.PropTypes.instanceOf(Date),
		onDateChange: React.PropTypes.func,
		mode: React.PropTypes.string,
		onCreateEvent: React.PropTypes.func,
	}
	state: State;

	unControlledDate: Date;

	constructor(props: Props) {
		super(props);

		this.unControlledDate= new Date();
		this.state = {
			scrollPosition: 630,
			isSwiping: false,
			newEvent: null,
		};
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return getTimeOrDefault(nextProps.date) !== getTimeOrDefault(this.props.date)
			|| nextProps.mode !== this.props.mode
			|| nextState.scrollPosition !== this.state.scrollPosition
			|| nextState.isSwiping !== this.state.isSwiping
			|| nextState.newEvent !== this.state.newEvent;
	}

	render() {
		return (
			<VirtualizeSwipeableViews
				key={this.getMode()}
				style={this.props.style}
				slideStyle={{ height: '100%' }}
				containerStyle={{ height: '100%', willChange: 'transform' }}
				index={this.getIndex()}
				overscanSlideAfter={1}
				overscanSlideBefore={1}
				slideRenderer={this.slideRenderer}
				onChangeIndex={this.onChangeIndex}
				onSwitching={this.onSwitching}/>
		)
	}

	onSwitching = (index: number, mode: 'move' | 'end') => {
		this.setState({
			isSwiping: mode === 'move'
		});
	}

	getDate = () => {
		return this.props.date != null ? this.props.date : this.unControlledDate;
	}

	getMode = () => this.props.mode == null ? 'day' : this.props.mode;

	getIndex = () => {
		return Math.round(diffDays(startOfDay(this.getDate()), referenceDate) / modeNbOfDaysMap[this.getMode()]);
	}

	onChangeIndex = (index: number, indexLatest: number) => {
		var date = addDays(referenceDate, index * modeNbOfDaysMap[this.getMode()]);
		this.unControlledDate = date;
		if(this.props.onDateChange != null) {
			this.props.onDateChange(date);
		}
	}

	slideRenderer = (slide: { key: number, index: number }) => {
		if(this.getMode() === 'day') {
			return (
				<div key={slide.key} style={{ position: 'relative', height: '100%', width: '100%' }}>
					<DayView
						onScrollChange={this.onScrollChange}
						scrollPosition={this.state.scrollPosition}
						date={addDays(referenceDate, slide.index)}
						isScrollDisable={this.state.isSwiping}
						onHourDividerClick={this.onCalendarClick}
						newEvent={this.state.newEvent}
						onCreateEvent={this.onCreateEvent}
						children={getEventsFromChildren(this.props.children)}/>
				</div>
			);
		}

		return (
			<div key={slide.key} style={{ position: 'relative', height: '100%', width: '100%' }}>
				<MultipleDaysView
					onScrollChange={this.onScrollChange}
					scrollPosition={this.state.scrollPosition}
					dates={this.getMode() === 'week' ? this.getWeekDates(slide.index) : this.getThreeDaysDates(slide.index)}
					isScrollDisable={this.state.isSwiping}
					onHourDividerClick={this.onCalendarClick}
					newEvent={this.state.newEvent}
					onCreateEvent={this.onCreateEvent}
					children={getEventsFromChildren(this.props.children)}>
				</MultipleDaysView>
			</div>
		);
	}

	getWeekDates = (index: number) => {
		var currentDay = addDays(referenceDate, index * 7);
		var dates = [];
    for(var i = 0; i < 7; i++) {
      dates.push(addDays(currentDay, i - currentDay.getDay()));
    }
		return dates;
	}

	getThreeDaysDates = (index: number) => {
		var currentDay = addDays(referenceDate, index * 3);
		var dates = [];
    for(var i = 0; i < 3; i++) {
      dates.push(addDays(currentDay, i));
    }
		return dates;
	}

	onScrollChange = (scrollPosition: number) => {
		this.setState({ scrollPosition: scrollPosition });
	}

	onCalendarClick = (start: Date, end: Date) => {
		if(this.props.onCreateEvent != null) {
			this.setState({ newEvent : { start: start, end: end }});
		}
	}

	onCreateEvent = () => {
		if(this.props.onCreateEvent != null && this.state.newEvent != null) {
			this.props.onCreateEvent(this.state.newEvent.start, this.state.newEvent.end);
			this.setState({
				newEvent: null
			});
		}
	}
}

export default Calendar;

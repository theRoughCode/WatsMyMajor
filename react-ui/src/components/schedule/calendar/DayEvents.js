// @flow
import type { EventElement } from './types';

import React from 'react';
import { addDays } from './dateUtils';
import { every } from './utils';

type Column = {
	column: number,
	over: number
}

type DayViewItem = {
	x: number,
	y: number,
	height: number,
	width: number,
	event: EventElement		
}

const msInDay = 1000 * 60 * 60 * 24;

function getEventsBetweenDates(events, start, end) {
	return events
		.filter(event => event.props.start < end && event.props.end > start);
}

function getEventColumn(event: EventElement, columnsLastDate: Date[]): number {
	for (let i = 0; i < columnsLastDate.length; i++) {
		if (event.props.start >= columnsLastDate[i]) {
			return i;
		}
	}
	return columnsLastDate.length;
}

function getEventsColumns(events: EventElement[]) : Column[] {
	let columnsLastDate = [];
	const results = [];
	let nextOverIndex = 0;

	function setOverColumnOnEventGroup(end) {
		for (let j = nextOverIndex; j < end; j++) {
			results[j].over = columnsLastDate.length;
		}
		columnsLastDate = [];
		nextOverIndex = end;
	}

	for (let i = 0; i < events.length; i++) {
		const app = events[i];
		let column;

		if (columnsLastDate.length !== 0 && every(columnsLastDate, d => app.props.start >= d)) {
			setOverColumnOnEventGroup(i);
		}

		column = getEventColumn(app, columnsLastDate);
		columnsLastDate[column] = app.props.end;
		results.push({ column: column, over: -1 });
	}

	setOverColumnOnEventGroup(events.length);

	return results;
}

function getEventItemY(event: EventElement, date: Date) {
	if(event.props.start < date) {
		return 0;
	}

	return ((event.props.start.getTime() - date.getTime()) / msInDay);
}

function getEventItemHeight(event: EventElement, date: Date) {
	var maxedDate = event.props.end.getTime() > (date.getTime() + msInDay) ?
		date.getTime() + msInDay :
		event.props.end.getTime();

	var minDate = event.props.start < date ? date.getTime() : event.props.start.getTime();
	return (maxedDate - minDate) / msInDay;
}

function eventsToDayViewItems(events: EventElement[], date: Date) {
	const sortedEvents = events.sort((a, b) => a.props.start.getTime() - b.props.start.getTime());
	const eventsColumn = getEventsColumns(sortedEvents);
	return sortedEvents
		.map((event, i) => ({
			x: eventsColumn[i].column / eventsColumn[i].over,
			y: getEventItemY(event, date),
			width: (1 / eventsColumn[i].over),
			height: getEventItemHeight(event, date),
			event: event
		}));
}

function toPercent(i) {
	return (i * 100) + '%';
}

function getHourDividerStyle(hour) {
	return {
		height: (100 / 24) + '%',
		top: (hour * (100 / 24)) + '%',
		right: '0px',
		left: '0px',
		position: 'absolute',
		borderBottomColor: '#F3F3F3',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		boxSizing: 'border-box'
	};
}

function handleHourDividerClick(date:Date, hour: number, onHourDividerClick) {
	return function() {
		var start = new Date(date.getTime());
		start.setHours(hour);
		var end = new Date(date.getTime());
		end.setHours(hour + 1);
		onHourDividerClick(start, end);
	}
}

function renderHoursDividers(date: Date, onHourDividerClick: (start: Date, end: Date) => void) {
  var dividers = [];
  for(var i = 0; i < 24; i++) {
    dividers.push(
      <div 
        key={i + 'divider'} 
				onClick={handleHourDividerClick(date,i,onHourDividerClick)}
        style={getHourDividerStyle(i)}>
      </div>
    );
  }
  return dividers;
}

function renderEventsItems(events: EventElement[], date:Date) {
  var items = eventsToDayViewItems(getEventsBetweenDates(events, date, addDays(date,1)), date);
  return items
    .map(item => {
      return React.cloneElement(item.event, { 
        style: Object.assign({}, item.event.props.style, getDayViewItemStyle(item))
      });
    });
}

function getDayViewItemStyle(item: DayViewItem) {
  return {
    height: `calc(${toPercent(item.height)} - 3px)`,
    width: `calc(${toPercent(item.width)} - 5px)`,
    top: toPercent(item.y),
    left: toPercent(item.x),
    position: 'absolute',
    boxSizing: 'border-box',
    minHeight: '10px',
		//Styling
		padding: '0 2.5px',
		cursor: 'pointer',
		borderRadius: '2px',
		fontSize: '12px',
		color: item.event.props.color ? item.event.props.color : 'white',
		background: item.event.props.background ? item.event.props.background : '#049BE5'
  };
}

function renderNewEvent(date: Date, newEvent, onCreateEvent: () => void) {
	if(newEvent == null || newEvent.start >= addDays(date,1) || newEvent.end <= date) {
		return [];
	}

  return (
		<div 
			key={'newEvent'}
			style={{
				width: '100%',
				height: toPercent((newEvent.end.getTime() - newEvent.start.getTime()) / 60000 / 1440),
				top: toPercent((newEvent.start.getTime() - date.getTime()) / 60000 / 1440),
				left: '0',
				position: 'absolute',
				boxSizing: 'border-box',
				background: '#049BE5',
				color: 'white',
				fontSize: '20px',
				opacity: '0.6'
			}}
			onClick={onCreateEvent}>
			<div style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				+
			</div>
		</div>
	);
}

type Props = {
	events: EventElement[], 
	date: Date, 
	newEvent: ?{
		start: Date,
		end: Date	
	},
	onHourDividerClick: (start: Date, end: Date) => void,
	onCreateEvent: () => void,
}

var DayEvents = (props: Props) => {
	return renderHoursDividers(props.date, props.onHourDividerClick)
		.concat(renderEventsItems(props.events, props.date))
		.concat(renderNewEvent(props.date, props.newEvent, props.onCreateEvent));
}

export default DayEvents;
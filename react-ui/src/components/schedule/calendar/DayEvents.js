import React from 'react';
import { addDays } from './dateUtils';
import { every } from './utils';

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

function eventsToDayViewItems(events, date) {
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
		borderBottomColor: '#e2e2e2',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		boxSizing: 'border-box'
	};
}

function renderHoursDividers(date: Date) {
  var dividers = [];
  for(var i = 0; i < 24; i++) {
    dividers.push(
      <div
        key={i + 'divider'}
        style={getHourDividerStyle(i)}>
      </div>
    );
  }
  return dividers;
}

function renderEventsItems(events, date) {
  const items = eventsToDayViewItems(getEventsBetweenDates(events, date, addDays(date,1)), date);
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
		display: 'flex',
		flexDirection: 'column',
		verticalAlign: 'middle',
		color: item.event.props.color ? item.event.props.color : 'white',
		background: item.event.props.background ? item.event.props.background : '#049BE5'
  };
}

const DayEvents = ({ date, events }) => {
	return renderHoursDividers(date).concat(renderEventsItems(events, date));
}

export default DayEvents;

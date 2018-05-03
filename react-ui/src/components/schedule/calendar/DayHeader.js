// @flow
import React from 'react';

var previousDayColor = '#8D8D8D';
var currentDayColor = '#4285F4';
var futureDayColor = 'black';

//Assume that date have 0min 0sec 0ms
function getHeaderColor(date: Date): string {
	var diff = new Date().getTime() - date.getTime();
  if(diff < 0) {
    return futureDayColor;
  } else if (diff > (3600 * 1000 * 24)) {
    return previousDayColor;
  }
  return currentDayColor;
}

var weekDayFormatter = new Intl.DateTimeFormat(window.navigator.language, { weekday: 'short' });
var dayFormatter = new Intl.DateTimeFormat(window.navigator.language, { day: 'numeric' });

type Props = {
  style: any,
  date: Date
}

const DayHeader = (props: Props) => {
  return (
    <div style={Object.assign(props.style, { color: getHeaderColor(props.date)})}>
      <div style={{ fontSize: '22px' }}>
        {
          dayFormatter.format(props.date)
        }
      </div>
      <div style={{ fontSize: '12px' }}>
        {
          weekDayFormatter.format(props.date)
        }
      </div>
    </div>
  )
}

export default DayHeader;
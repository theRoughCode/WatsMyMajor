// @flow
import React from 'react';

const previousDayColor = '#8D8D8D';
const currentDayColor = '#4285F4';
const futureDayColor = 'black';

//Assume that date have 0min 0sec 0ms
function getHeaderColor(date: Date): string {
	const diff = new Date().getTime() - date.getTime();
  if(diff < 0) {
    return futureDayColor;
  } else if (diff > (3600 * 1000 * 24)) {
    return previousDayColor;
  }
  return currentDayColor;
}

const weekDayFormatter = new Intl.DateTimeFormat(window.navigator.language, { weekday: 'short' });
const dayFormatter = new Intl.DateTimeFormat(window.navigator.language, { day: 'numeric' });

const DayHeader = ({ style, date }) => {
  return (
    <div style={Object.assign({}, style, { color: getHeaderColor(date)})}>
      <div style={{ fontSize: '22px' }}>
        {
          dayFormatter.format(date)
        }
      </div>
      <div style={{ fontSize: '12px' }}>
        {
          weekDayFormatter.format(date)
        }
      </div>
    </div>
  )
}

export default DayHeader;

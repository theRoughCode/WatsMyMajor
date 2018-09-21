// @flow

import React from 'react';

function getHourStyle(i) {
  return {
    height: `${100 / 16}%`,
    top: `calc(${(100 / 16) * i}% - 10px)`,
    left: 15,
    position: 'absolute',
    color: '#525252',
    fontSize: 12
  };
}

export default function verticalHours() {
  const hours = [];
  for (let i = 8; i < 12; i++) {
    hours.push(<span key={ i + 'AM' } style={ getHourStyle(i - 7) }>{ i + 'AM' }</span>);
  }
  hours.push(<span key={ '12PM' } style={ getHourStyle(5) }>{ '12PM' }</span>)
  for (let i = 1; i < 12; i++) {
    hours.push(<span key={ i + 'PM' } style={ getHourStyle(i + 5) }>{ i + 'PM' }</span>);
  }
  return hours;
}

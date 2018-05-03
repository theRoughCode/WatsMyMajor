// @flow

import React from 'react';

function getHourStyle(i) {
	return {
		height: `${100 / 24}%`,
		top: `calc(${(100 / 24) * i}% - 10px)`,
		left: '15px',
		position: 'absolute',
		color: '#525252',
		fontSize: '12px'
	};
}

export default function verticalHours() {
	var hours = [];
	for(var i = 1; i < 24; i++) {
		hours.push(<span key={i + 'h'} style={getHourStyle(i) }>{i + 'h'}</span>);
	}
	return hours;
}
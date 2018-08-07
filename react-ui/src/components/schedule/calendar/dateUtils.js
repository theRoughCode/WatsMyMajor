// @flow
const moment = require('moment');

export function addDays(date: Date, nbOfDays: number): Date {
	const newDateMoment = moment(date).add(nbOfDays, 'days');
	return newDateMoment.toDate();
}

export function diffDays(a: Date, b: Date): number {
	const aMoment = moment(a);
	const bMoment = moment(b);
	return aMoment.diff(bMoment, 'days');
}

export function startOfDay(date: Date): Date {
	return moment(date).startOf('day');
}

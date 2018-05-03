// @flow

export function addDays(date: Date, nbOfDays: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + nbOfDays);
}

export function diffDays(a: Date, b: Date): number {
	return (a.getTime() - b.getTime()) / 1000 / 3600 / 24;
}

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
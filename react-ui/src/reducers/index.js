import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_COURSE,
	SET_EXPANDED_COURSE,
	SET_VIEW
} from '../actions/index';
import { DASHBOARD_VIEW, COURSE_VIEW } from '../constants/views';

function view(state = COURSE_VIEW, action) {
	switch (action.type) {
		case SET_VIEW:
			return action.view;
		default:
			return state;
	}
}

function course(state = { subject: 'CS', catalogNumber: '136' }, action) {
	switch(action.type) {
		case SET_COURSE:
			return action.course;
		default:
			return state;
	}
}

function expandedCourse(state={}, action) {
	switch(action.type) {
		case SET_EXPANDED_COURSE:
			let {
				instructor,
				attending,
				enrollmentCap,
				reserved,
				reservedCap,
				classNumber,
				lastUpdated,
				index
			} = action;

			if (state.selectedClassIndex === index) {
				instructor = '';
				attending = '';
				enrollmentCap = '';
				reserved = '';
				reservedCap = '';
				classNumber = '';
				lastUpdated = '';
				index = -1;
			}

			return {
				instructor,
				attending,
				enrollmentCap,
				reserved,
				reservedCap,
				classNumber,
				lastUpdated,
				selectedClassIndex: index
			};
		default:
			return state;
	}
}

function sideBarOpen(state = true, action) {
	switch (action.type) {
		case TOGGLE_SIDEBAR:
			return !state;
		default:
			return state;
	}
}

const reducers = combineReducers({
	view,
	course,
	expandedCourse,
	sideBarOpen
});

export default reducers;

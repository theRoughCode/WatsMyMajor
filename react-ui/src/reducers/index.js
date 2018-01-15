import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_COURSE,
	SET_EXPANDED_COURSE,
	SET_VIEW,
	CREATE_SNACK,
	UPDATE_USER_COURSES,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	REORDER_CART
} from '../actions/index';
import {
	DASHBOARD_VIEW,
	COURSE_LIST_VIEW,
	MY_COURSE_VIEW
} from '../constants/views';

function view(state = MY_COURSE_VIEW, action) {
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

const snackInitialState = {
	msg: '',
	actionMsg: '',
	undoMsg: '',
	onActionClick: () => {}
};
function snack(state = snackInitialState, action) {
	switch (action.type) {
		case CREATE_SNACK:
			const {
				msg,
				actionMsg,
				undoMsg,
				handleActionClick
			} = action;
			return {
				msg,
				actionMsg,
				undoMsg,
				handleActionClick
			};
		default:
			return state;
	}
}

function courseList(state = {}, action) {
	switch (action.type) {
		case UPDATE_USER_COURSES:
			return { courseList: action.courseList };
		default:
			return state;
	}
}

function cart(state = [], action) {
	switch (action.type) {
		case ADD_TO_CART:
			state.push(action.course);
			return state;
		case REMOVE_FROM_CART:
			return state.filter(course => course.id !== action.id);
		case REORDER_CART:
			return action.cart;
		default:
			return state;
	}
}

const reducers = combineReducers({
	view,
	course,
	expandedCourse,
	sideBarOpen,
	snack,
	courseList,
	cart
});

export default reducers;

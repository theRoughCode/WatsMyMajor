import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_USER,
	SET_EXPANDED_COURSE,
	CREATE_SNACK,
	UPDATE_USER_COURSES,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	REORDER_CART
} from '../actions/index';

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

function courseList(state = [], action) {
	switch (action.type) {
		case SET_USER:
			return action.payload.courseList || [];
		case UPDATE_USER_COURSES:
			return action.meta.courseList || state;
		default:
			return state;
	}
}

// Helper function for myCourses
function getMyCourses(courseList) {
	if (!courseList) return [];
	courseList = courseList.map(term => term.courses || []);
	// Flatten array
	return [].concat.apply([], courseList);
}
// List of courses in My Courses
function myCourses(state = [], action) {
	switch (action.type) {
		case SET_USER:
			return getMyCourses(action.payload.courseList);
		case UPDATE_USER_COURSES:
			return getMyCourses(action.meta.courseList);
		default:
			return state;
	}
}

function cart(state = [], action) {
	switch (action.type) {
		case SET_USER:
			return action.payload.cart || state;
		case ADD_TO_CART:
			state.push(action.course);
			return state;
		case REMOVE_FROM_CART:
			return state.filter(course =>
				course.subject !== action.subject ||
				course.catalogNumber !== action.catalogNumber
			);
		case REORDER_CART:
			return action.cart;
		default:
			return state;
	}
}

const defaultUser = {
	username: 'theroughcode',
	name: 'Raphael Koh'
};
function user(state = defaultUser, action) {
	switch (action.type) {
		case SET_USER:
			const { username } = action.meta;
			const { name, schedule } = action.payload;
			const user = {
				username: username || '',
				name: name || '',
				schedule: schedule || []
			}
			return user;
		default:
			return state;
	}
}

const reducers = combineReducers({
	expandedCourse,
	sideBarOpen,
	snack,
	courseList,
	myCourses,
	cart,
	user
});

export default reducers;

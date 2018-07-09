import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_USER,
	SET_EXPANDED_COURSE,
	CREATE_SNACK,
	UPDATE_USER_COURSES,
	UPDATE_USER_COURSES_PREREQS,
	SET_CART,
	SET_CART_PREREQS,
	HIGHLIGHT_PREREQS,
	UNHIGHLIGHT_PREREQS,
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
			if (action.user == null) return [];
			return action.user.courseList || [];
		case UPDATE_USER_COURSES:
			return action.meta.courseList || state;
		case UPDATE_USER_COURSES_PREREQS:
			return action.payload || state;
		default:
			return state;
	}
}

// Helper function for myCourses
function getMyCourses(courseList) {
	if (!courseList) return {};

	const courseMap = {};

	for (var i = 0; i < courseList.length; i++) {
		const { courses } = courseList[i];
		if (courses == null) continue;

		for (var j = 0; j < courses.length; j++) {
			const { subject, catalogNumber} = courses[j];
			if (subject == null) continue;

			if (!courseMap.hasOwnProperty(subject)) courseMap[subject] = {};
			courseMap[subject][catalogNumber] = true;
		}
	}
	return courseMap;
}
// List of courses in My Courses
function myCourses(state = {}, action) {
	switch (action.type) {
		case SET_USER:
			if (action.user == null) return {};
			return getMyCourses(action.user.courseList);
		case UPDATE_USER_COURSES:
			return getMyCourses(action.meta.courseList);
		default:
			return state;
	}
}

function cart(state = [], action) {
	switch (action.type) {
		case SET_USER:
			if (action.user == null) return [];
			return action.user.cart || state;
		case SET_CART:
			return action.meta.cart;
		case SET_CART_PREREQS:
			return action.payload || state;
		default:
			return state;
	}
}

const defaultUser = {
	username: '',
	name: ''
};
function user(state = defaultUser, action) {
	switch (action.type) {
		case SET_USER:
			const { username, user } = action;
			if (user == null) return { username };
			const { name, schedule } = user;
			return {
				username: username || '',
				name: name || '',
				schedule: schedule || []
			};
		default:
			return state;
	}
}

function courseCardPrereqs(state = [], action) {
	switch (action.type) {
		case HIGHLIGHT_PREREQS:
			return action.prereqs || state;
		case UNHIGHLIGHT_PREREQS:
			return [];
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
	user,
	courseCardPrereqs,
});

export default reducers;

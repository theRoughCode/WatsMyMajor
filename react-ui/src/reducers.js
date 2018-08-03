import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_USER,
	LOGIN_USER,
	LOGOUT_USER,
	SET_EXPANDED_COURSE,
	REMOVE_EXPANDED_COURSE,
	CREATE_SNACK,
	UPDATE_USER_COURSES,
	UPDATE_USER_COURSES_PREREQS,
	SET_CART,
	SET_CART_PREREQS,
	HIGHLIGHT_PREREQS,
	UNHIGHLIGHT_PREREQS,
	EDIT_SETTINGS,
	EDIT_SETTINGS_FAILURE,
} from './actions';

const defaultExpandedCourse = {
	instructor: '',
	attending: '',
	enrollmentCap: '',
	reserved: '',
	reservedCap: '',
	classNumber: '',
	lastUpdated: '',
	index: -1,
};
function expandedCourse(state=defaultExpandedCourse, action) {
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

			if (state.selectedClassIndex === index) return defaultExpandedCourse;

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
		case REMOVE_EXPANDED_COURSE:
			return defaultExpandedCourse;
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
		case LOGIN_USER:
			if (action.payload == null) return [];
			return action.payload.courseList || state;
		case LOGOUT_USER:
			return [];
		case UPDATE_USER_COURSES:
			return action.meta.courseList || state;
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
			const { subject, catalogNumber, prereqs } = courses[j];
			if (subject == null) continue;

			if (!courseMap.hasOwnProperty(subject)) courseMap[subject] = {};
			courseMap[subject][catalogNumber] = prereqs || [];
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
		case LOGIN_USER:
			if (action.payload == null) return [];
			return getMyCourses(action.payload.courseList) || state;
		case LOGOUT_USER:
			return {};
		case UPDATE_USER_COURSES:
			return getMyCourses(action.meta.courseList);
		case UPDATE_USER_COURSES_PREREQS:
			return getMyCourses(action.payload) || state;
		default:
			return state;
	}
}

function cart(state = [], action) {
	switch (action.type) {
		case SET_USER:
			if (action.user == null) return [];
			return action.user.cart || state;
		case LOGIN_USER:
			if (action.payload == null) return [];
			return action.payload.cart || state;
		case LOGOUT_USER:
			return [];
		case SET_CART:
			return action.meta.cart;
		case SET_CART_PREREQS:
			return action.payload || state;
		default:
			return state;
	}
}

const defaultUser = { username: '', name: '' };
const usernameKey = 'wat-username';  // Used to cache user's session

function user(state = defaultUser, action) {
	switch (action.type) {
		case SET_USER:
			localStorage.setItem(usernameKey, action.username);
			action.user.username = action.username;
			return action.user || defaultUser;
		case LOGIN_USER:
			const { meta, payload } = action;
			localStorage.setItem(usernameKey, meta.username);
			payload.username = meta.username;
			return payload || defaultUser;
		case LOGOUT_USER:
			localStorage.removeItem(usernameKey);
			return defaultUser;
		case EDIT_SETTINGS:
			return Object.assign({}, state, action.meta.user);
		case EDIT_SETTINGS_FAILURE:
			console.log(action.payload);
			alert('Failed to update settings.  Please contact an administrator.');
			return state;
		default:
			return state;
	}
}

// TODO: Get login status from JWT
function isLoggedIn(state = false, action) {
	switch (action.type) {
		case SET_USER:
		case LOGIN_USER:
			return true;
		case LOGOUT_USER:
			return false;
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
	isLoggedIn,
	courseCardPrereqs,
});

export default reducers;

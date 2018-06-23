import { combineReducers } from 'redux'
import {
	TOGGLE_SIDEBAR,
	SET_USER,
	SET_COURSE,
	SET_EXPANDED_COURSE,
	CREATE_SNACK,
	UPDATE_USER_COURSES,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	REORDER_CART
} from '../actions/index';

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

function courseList(state = [], action) {
	switch (action.type) {
		case UPDATE_USER_COURSES:
			return action.meta.courseList;
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

const defaultUser = {
	username: 'theroughcode',
	name: 'Raphael Koh'
};
function user(state = defaultUser, action) {
	switch (action.type) {
		case SET_USER:
			const { username } = action.meta;
			const { name, cart, schedule, courseList } = action.payload;
			const user = {
				username: username || '',
				name: name || '',
				cart: cart || [],
				schedule: schedule || [],
				courseList: courseList || []
			}
			return user;
		default:
			return state;
	}
}

const reducers = combineReducers({
	course,
	expandedCourse,
	sideBarOpen,
	snack,
	courseList,
	cart,
	user
});

export default reducers;

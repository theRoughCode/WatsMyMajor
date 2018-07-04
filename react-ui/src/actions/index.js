import { RSAA } from 'redux-api-middleware';

/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_USER = 'SET_USER';
export const SET_EXPANDED_COURSE = 'SET_EXPANDED_COURSE';
export const CREATE_SNACK = 'CREATE_SNACK';
export const UPDATE_USER_COURSES = 'UPDATE_USER_COURSES';
export const UPDATE_USER_COURSES_SUCCESS = 'UPDATE_USER_COURSES_SUCCESS';	// not used
export const UPDATE_USER_COURSES_FAILURE = 'UPDATE_USER_COURSES_FAILURE';	// not used
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const REORDER_CART = 'REORDER_CART';

/*
 * action creators
 */

export function toggleSideBar() {
	return { type: TOGGLE_SIDEBAR };
}

export function setUser(username) {
	return {
		[RSAA]: {
			endpoint: `/users/${username}`,
			method: 'GET',
			types: ['', { type: SET_USER, meta: { username } }, '']
		}
	};
}

export function setExpandedCourse(courseObj, index) {
	const {
		instructor,
		enrollment_total,
		enrollment_capacity,
		waiting_total,
		waiting_capacity,
		class_number,
		last_updated
	} = courseObj;

	return {
		type: SET_EXPANDED_COURSE,
		index,
		instructor,
		attending: String(enrollment_total),
		enrollmentCap: String(enrollment_capacity),
		reserved: String(waiting_total),
		reservedCap: String(waiting_capacity),
		classNumber: String(class_number),
		lastUpdated: last_updated
	};
}

export function createSnack(msg, actionMsg, undoMsg, handleActionClick) {
	return {
		type: CREATE_SNACK,
		msg,
		actionMsg,
		undoMsg,
		handleActionClick
	};
}

export function updateUserCourses(username, courseList) {
	return {
		[RSAA]: {
			endpoint: `/users/set/courselist/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ courseList }),
			types: [
				{
					type: UPDATE_USER_COURSES,
					meta: { courseList }
				},
				UPDATE_USER_COURSES_SUCCESS,
				UPDATE_USER_COURSES_FAILURE
			]
		}
	};
}

export function addToCart(subject, catalogNumber, id) {
	return {
		type: ADD_TO_CART,
		course: { subject, catalogNumber }
	};
}

export function removeFromCart(subject, catalogNumber) {
	return {
		type: REMOVE_FROM_CART,
		subject,
		catalogNumber
	};
}

export function reorderCart(cart) {
	return {
		type: REORDER_CART,
		cart
	};
}

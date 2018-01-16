/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_COURSE = 'SET_COURSE';
export const SET_EXPANDED_COURSE = 'SET_EXPANDED_COURSE';
export const SET_VIEW = 'SET_VIEW';
export const CREATE_SNACK = 'CREATE_SNACK';
export const UPDATE_USER_COURSES = 'UPDATE_USER_COURSES';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const REORDER_CART = 'REORDER_CART';

/*
 * action creators
 */

export function toggleSideBar() {
	return { type: TOGGLE_SIDEBAR };
}

export function setCourse(courseStr) {
	const [ subject, catalogNumber ] = courseStr.split(' ');

	return {
		type: SET_COURSE,
		course: {
			subject,
			catalogNumber
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

export function setView(view) {
	return { type: SET_VIEW, view };
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

export function updateUserCourses(courseList) {
	return {
		type: UPDATE_USER_COURSES,
		courseList
	};
}

export function addToCart(subject, catalogNumber, id) {
	return {
		type: ADD_TO_CART,
		course: {
			subject,
			catalogNumber,
			id
		}
	};
}

export function removeFromCart(id) {
	return {
		type: REMOVE_FROM_CART,
		id
	};
}

export function reorderCart(cart) {
	return {
		type: REORDER_CART,
		cart
	};
}

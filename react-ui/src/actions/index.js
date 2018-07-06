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
export const SET_CART = 'SET_CART';
export const SET_CART_SUCCESS = 'SET_CART_SUCCESS';	// not used
export const SET_CART_FAILURE = 'SET_CART_FAILURE';	// not used

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

// TODO: Change approach to update immediately and then fallback on failure

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

export function addToCart(subject, catalogNumber, username, cart) {
	cart = cart.concat([{ subject, catalogNumber }]);
	return {
		[RSAA]: {
			endpoint: `/users/set/cart/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ cart }),
			types: [
				{
					type: SET_CART,
					meta: { cart }
				},
				SET_CART_SUCCESS,
				SET_CART_FAILURE
			]
		}
	};
}

export function removeFromCart(subject, catalogNumber, username, cart) {
	cart = cart.filter(course =>
		course.subject !== subject ||
		course.catalogNumber !== catalogNumber
	);
	return {
		[RSAA]: {
			endpoint: `/users/set/cart/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ cart }),
			types: [
				{
					type: SET_CART,
					meta: { cart }
				},
				SET_CART_SUCCESS,
				SET_CART_FAILURE
			]
		}
	};
}

export function reorderCart(cart, username) {
	return {
		[RSAA]: {
			endpoint: `/users/set/cart/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ cart }),
			types: [
				{
					type: SET_CART,
					meta: { cart }
				},
				SET_CART_SUCCESS,
				SET_CART_FAILURE
			]
		}
	};
}

import { RSAA } from 'redux-api-middleware';

/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_USER = 'SET_USER';
export const SET_EXPANDED_COURSE = 'SET_EXPANDED_COURSE';
export const CREATE_SNACK = 'CREATE_SNACK';
export const UPDATE_USER_COURSES = 'UPDATE_USER_COURSES';
export const UPDATE_USER_COURSES_PREREQS = 'UPDATE_USER_COURSES_PREREQS';
export const SET_CART = 'SET_CART';
export const SET_CART_PREREQS = 'SET_CART_PREREQS';
export const HIGHLIGHT_PREREQS = 'HIGHLIGHT_PREREQS';
export const UNHIGHLIGHT_PREREQS = 'UNHIGHLIGHT_PREREQS';

/*
 * action creators
 */

export const toggleSideBar = () => ({ type: TOGGLE_SIDEBAR });

export const setUser = (username, user) => ({
	type: SET_USER,
	username,
	user
});

export const setExpandedCourse = (courseObj, index) => {
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

export const createSnack = (
	msg,
	actionMsg,
	undoMsg,
	handleActionClick
) => ({
	type: CREATE_SNACK,
	msg,
	actionMsg,
	undoMsg,
	handleActionClick
});


// TODO: Change approach to update immediately and then fallback on failure
// Used when adding to courses
export const updateUserCourses = (username, courseList) => ({
	[RSAA]: {
		endpoint: `/users/set/courselist/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ courseList }),
		types: [
			{ type: UPDATE_USER_COURSES, meta: { courseList } },
			{ type: UPDATE_USER_COURSES_PREREQS },
			''
		]
	}
});

export const reorderUserCourses = (username, courseList) => ({
	[RSAA]: {
		endpoint: `/users/reorder/courselist/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ courseList }),
		types: [
			{ type: UPDATE_USER_COURSES, meta: { courseList } },
			'',
			''
		]
	}
});

export const addToCart = (subject, catalogNumber, username, cart) => {
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
				{ type: SET_CART, meta: { cart } },
				{ type: SET_CART_PREREQS },
				''
			]
		}
	};
}

export const removeFromCart = (subject, catalogNumber, username, cart) => {
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
			types: [{ type: SET_CART, meta: { cart } }, '', '']
		}
	};
}

export const reorderCart = (username, cart) => ({
	[RSAA]: {
		endpoint: `/users/reorder/cart/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ cart }),
		types: [{ type: SET_CART, 	meta: { cart } }, '', '']
	}
});

export const highlightPrereqs = (prereqs) => ({ type: HIGHLIGHT_PREREQS, prereqs });

export const unhighlightPrereqs = () => ({ type: UNHIGHLIGHT_PREREQS })

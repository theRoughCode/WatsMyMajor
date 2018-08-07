import { RSAA } from 'redux-api-middleware';
import { getCookie, deleteCookie } from './utils/cookies';

/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_USER = 'SET_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_EXPANDED_COURSE = 'SET_EXPANDED_COURSE';
export const REMOVE_EXPANDED_COURSE = 'REMOVE_EXPANDED_COURSE';
export const CREATE_SNACK = 'CREATE_SNACK';
export const UPDATE_USER_COURSES = 'UPDATE_USER_COURSES';
export const UPDATE_USER_COURSES_PREREQS = 'UPDATE_USER_COURSES_PREREQS';
export const UPDATE_USER_SCHEDULE = 'UPDATE_USER_SCHEDULE';
export const UPDATE_USER_SCHEDULE_FAILURE = 'UPDATE_USER_SCHEDULE_FAILURE';
export const CLEAR_USER_SCHEDULE = 'CLEAR_USER_SCHEDULE';
export const CLEAR_USER_SCHEDULE_FAILURE = 'CLEAR_USER_SCHEDULE_FAILURE';
export const SET_CART = 'SET_CART';
export const SET_CART_PREREQS = 'SET_CART_PREREQS';
export const HIGHLIGHT_PREREQS = 'HIGHLIGHT_PREREQS';
export const UNHIGHLIGHT_PREREQS = 'UNHIGHLIGHT_PREREQS';
export const EDIT_SETTINGS = 'EDIT_SETTINGS';
export const EDIT_SETTINGS_FAILURE = 'EDIT_SETTINGS_FAILURE';
export const LINK_FACEBOOK = 'LINK_FACEBOOK';
export const LINK_FACEBOOK_FAILURE = 'LINK_FACEBOOK_FAILURE';
export const UNLINK_FACEBOOK = 'UNLINK_FACEBOOK';
export const UNLINK_FACEBOOK_FAILURE = 'UNLINK_FACEBOOK_FAILURE';

/*
 * action creators
 */

export const toggleSideBar = () => ({ type: TOGGLE_SIDEBAR });

export const setUser = (username, user) => ({
	type: SET_USER,
	username,
	user
});

export const loginUser = (username) => {
	if (!username) {
		console.error('Username is undefined. ' + username);
		return {};
	}

	return {
		[RSAA]: {
			endpoint: `/server/users/${username}`,
			method: 'GET',
			headers: {
				'X-Secret': process.env.REACT_APP_SERVER_SECRET,
				'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
			},
			types: ['', { type: LOGIN_USER, meta: { username } }, { type: LOGOUT_USER }]
		}
	}
};

export const logoutUser = () => {
	deleteCookie('watsmymajor_jwt');
	return { type: LOGOUT_USER };
};

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

export const removeExpandedCourse = () => ({ type: REMOVE_EXPANDED_COURSE });

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
// Updates course list.  Use this when adding new courses.
export const updateUserCourses = (username, courseList) => ({
	[RSAA]: {
		endpoint: `/server/users/add/courselist/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		body: JSON.stringify({ courseList }),
		types: [
			{ type: UPDATE_USER_COURSES, meta: { courseList } },
			{ type: UPDATE_USER_COURSES_PREREQS },
			''
		]
	}
});

// Reorders course list.  Does not create prereqs.  Do not call this function
// if there are new courses added.
export const reorderUserCourses = (username, courseList) => ({
	[RSAA]: {
		endpoint: `/server/users/reorder/courselist/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		body: JSON.stringify({ courseList }),
		types: [
			{ type: UPDATE_USER_COURSES, meta: { courseList } },
			'',
			''
		]
	}
});

export const addToSchedule = (username, text) => ({
	[RSAA]: {
		endpoint: `/server/users/add/schedule/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		body: JSON.stringify({ text }),
		types: [
			'',
			{ type: UPDATE_USER_SCHEDULE },
			{ type: UPDATE_USER_SCHEDULE_FAILURE },
		]
	}
});

export const clearSchedule = (username) => ({
	[RSAA]: {
		endpoint: `/server/users/set/schedule/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		body: JSON.stringify({ schedule: {} }),
		types: [
			'',
			{ type: CLEAR_USER_SCHEDULE },
			{ type: CLEAR_USER_SCHEDULE_FAILURE },
		]
	}
});

export const addToCart = (subject, catalogNumber, username, cart) => {
	cart = cart.concat([{ subject, catalogNumber }]);
	return {
		[RSAA]: {
			endpoint: `/server/users/set/cart/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Secret': process.env.REACT_APP_SERVER_SECRET,
				'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
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
			endpoint: `/server/users/set/cart/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Secret': process.env.REACT_APP_SERVER_SECRET,
				'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
			},
			body: JSON.stringify({ cart }),
			types: [{ type: SET_CART, meta: { cart } }, '', '']
		}
	};
}

export const reorderCart = (username, cart) => ({
	[RSAA]: {
		endpoint: `/server/users/reorder/cart/${username}`,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		body: JSON.stringify({ cart }),
		types: [{ type: SET_CART, 	meta: { cart } }, '', '']
	}
});

export const highlightPrereqs = (prereqs) => ({ type: HIGHLIGHT_PREREQS, prereqs });

export const unhighlightPrereqs = () => ({ type: UNHIGHLIGHT_PREREQS });

export const editSettings = (username, user) => {
	if (!username) {
		console.error('Username is undefined. ');
		return { type: '' };
	}

	return {
		[RSAA]: {
			endpoint: `/server/users/edit/settings/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Secret': process.env.REACT_APP_SERVER_SECRET,
				'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
			},
			body: JSON.stringify(user),
			types: [
				{ type: EDIT_SETTINGS, meta: { user } },
				'',
				{ type: EDIT_SETTINGS_FAILURE }
			]
		}
	}
}

export const linkFacebook = (username, facebookID, hasFBPic) => {
	if (!username) {
		console.error('Username is undefined.');
		return { type: '' };
	}

	return {
		[RSAA]: {
			endpoint: `/server/users/link/facebook/${username}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Secret': process.env.REACT_APP_SERVER_SECRET,
				'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
			},
			body: JSON.stringify({ facebookID, hasFBPic }),
			types: [
				'',
				{ type: LINK_FACEBOOK, meta: { username } },
				{ type: LINK_FACEBOOK_FAILURE },
			]
		}
	}
}

export const unlinkFacebook = (username) => ({
	[RSAA]: {
		endpoint: `/server/users/unlink/facebook/${username}`,
		method: 'GET',
		headers: {
			'X-Secret': process.env.REACT_APP_SERVER_SECRET,
			'Authorization': `Bearer ${getCookie('watsmymajor_jwt')}`
		},
		types: [
			'',
			{ type: UNLINK_FACEBOOK, meta: { username } },
			{ type: UNLINK_FACEBOOK_FAILURE },
		]
	}
});

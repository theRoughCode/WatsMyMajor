import { RSAA } from 'redux-api-middleware';

/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_USER = 'SET_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CREATE_SNACK = 'CREATE_SNACK';
export const UPDATE_USER_COURSES = 'UPDATE_USER_COURSES';
export const UPDATE_USER_COURSES_PREREQS = 'UPDATE_USER_COURSES_PREREQS';
export const UPDATE_USER_SCHEDULE = 'UPDATE_USER_SCHEDULE';
export const UPDATE_USER_SCHEDULE_FAILURE = 'UPDATE_USER_SCHEDULE_FAILURE';
export const CLEAR_USER_SCHEDULE = 'CLEAR_USER_SCHEDULE';
export const CLEAR_USER_SCHEDULE_FAILURE = 'CLEAR_USER_SCHEDULE_FAILURE';
export const SET_CART = 'SET_CART';
export const REORDER_CART = 'REORDER_CART';
export const SET_CART_PREREQS = 'SET_CART_PREREQS';
export const WATCH_CLASS = 'WATCH_CLASS';
export const UNWATCH_CLASS = 'UNWATCH_CLASS';
export const WATCH_CLASS_FAILURE = 'WATCH_CLASS_FAILURE';
export const UNWATCH_CLASS_FAILURE = 'UNWATCH_CLASS_FAILURE';
export const HIGHLIGHT_PREREQS = 'HIGHLIGHT_PREREQS';
export const UNHIGHLIGHT_PREREQS = 'UNHIGHLIGHT_PREREQS';
export const EDIT_SETTINGS = 'EDIT_SETTINGS';
export const EDIT_SETTINGS_FAILURE = 'EDIT_SETTINGS_FAILURE';
export const LINK_FACEBOOK = 'LINK_FACEBOOK';
export const LINK_FACEBOOK_FAILURE = 'LINK_FACEBOOK_FAILURE';
export const UNLINK_FACEBOOK = 'UNLINK_FACEBOOK';
export const UNLINK_FACEBOOK_FAILURE = 'UNLINK_FACEBOOK_FAILURE';
export const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS';
export const DELETE_ACCOUNT_FAILURE =  'DELETE_ACCOUNT_FAILURE';
export const UPDATE_COURSE_CLASSES = 'UPDATE_COURSE_CLASSES';

// For prefetching data
export const UPDATE_COURSE_METADATA = 'UPDATE_COURSE_METADATA';
export const UPDATE_COURSE_METADATA_ERROR = 'UPDATE_COURSE_METADATA_ERROR';
export const UPDATE_PROF_METADATA = 'UPDATE_PROF_METADATA';
export const UPDATE_PROF_METADATA_ERROR = 'UPDATE_PROF_METADATA_ERROR';

const padBaseUrl = (url) => `${global.baseUrl || ''}${url}`;

/*
 * action creators
 */

export const toggleSideBar = () => ({ type: TOGGLE_SIDEBAR });

export const setUser = (username, user) => ({
  type: SET_USER,
  username,
  user
});

export const loginUser = () => ({
  [RSAA]: {
    endpoint: padBaseUrl('/server/users/login'),
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET || process.env.SERVER_SECRET,
    },
    types: ['', { type: LOGIN_USER }, { type: LOGOUT_USER }]
  }
});

export const logoutUser = () => ({ type: LOGOUT_USER });

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
// Updates course list
export const updateUserCourses = (username, courseList) => ({
  [RSAA]: {
    endpoint: `/server/users/set/courselist/${username}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    body: JSON.stringify({ courseList }),
    types: [
      { type: UPDATE_USER_COURSES, meta: { courseList } },
      { type: UPDATE_USER_COURSES_PREREQS },
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
      },
      body: JSON.stringify({ cart }),
      types: [{ type: SET_CART, meta: { cart } }, '', '']
    }
  };
}

export const setCart = (username, cart) => ({
  [RSAA]: {
    endpoint: `/server/users/set/cart/${username}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    body: JSON.stringify({ cart }),
    types: [{ type: REORDER_CART,	meta: { cart } }, '', '']
  }
});

export const watchClass = (username, term, classNum) => ({
  [RSAA]: {
    endpoint: `/server/watchlist/watchers/add/${term}/${classNum}/${username}`,
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    types: [
      {
        type: WATCH_CLASS,
        meta: { term, classNum },
      },
      '',
      { type: WATCH_CLASS_FAILURE },
    ]
  }
});

export const unwatchClass = (username, term, classNum) => ({
  [RSAA]: {
    endpoint: `/server/watchlist/watchers/remove/${term}/${classNum}/${username}`,
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    types: [
      {
        type: UNWATCH_CLASS,
        meta: { term, classNum },
      },
      '',
      { type: UNWATCH_CLASS_FAILURE },
    ]
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
    },
    types: [
      '',
      { type: UNLINK_FACEBOOK, meta: { username } },
      { type: UNLINK_FACEBOOK_FAILURE },
    ]
  }
});

export const deleteAccount = (username) => ({
  [RSAA]: {
    endpoint: `/server/users/delete/${username}`,
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    types: [
      '',
      { type: DELETE_ACCOUNT_SUCCESS },
      { type: DELETE_ACCOUNT_FAILURE },
    ]
  }
});

export const getCourseMetadata = (subject, catalogNumber) => ({
  [RSAA]: {
    endpoint: padBaseUrl(`/server/courses/info/${subject}/${catalogNumber}`),
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET || process.env.SERVER_SECRET,
    },
    types: [
      '',
      { type: UPDATE_COURSE_METADATA },
      { type: UPDATE_COURSE_METADATA_ERROR },
    ]
  }
});

export const getCourseClasses = (subject, catalogNumber, term) => ({
  [RSAA]: {
    endpoint: `/server/courses/classes/${term}/${subject}/${catalogNumber}`,
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET,
    },
    types: [
      '',
      { type: UPDATE_COURSE_CLASSES },
      '',
    ]
  }
});

export const getProfMetadata = (profId) => ({
  [RSAA]: {
    endpoint: padBaseUrl(`/server/prof/info/${profId}`),
    method: 'GET',
    headers: {
      'X-Secret': process.env.REACT_APP_SERVER_SECRET || process.env.SERVER_SECRET,
    },
    types: [
      '',
      { type: UPDATE_PROF_METADATA },
      { type: UPDATE_PROF_METADATA_ERROR },
    ]
  }
});

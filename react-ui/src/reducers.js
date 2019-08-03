import { combineReducers } from 'redux';
import { toast } from 'react-toastify';
import {
  TOGGLE_SIDEBAR,
  SET_USER,
  LOGIN_USER,
  LOGOUT_USER,
  CREATE_SNACK,
  UPDATE_USER_COURSES,
  UPDATE_USER_COURSES_PREREQS,
  UPDATE_USER_SCHEDULE,
  UPDATE_USER_SCHEDULE_FAILURE,
  CLEAR_USER_SCHEDULE,
  CLEAR_USER_SCHEDULE_FAILURE,
  SET_CART,
  REORDER_CART,
  SET_CART_PREREQS,
  WATCH_CLASS,
  UNWATCH_CLASS,
  // WATCH_CLASS_FAILURE,
  // UNWATCH_CLASS_FAILURE,
  HIGHLIGHT_PREREQS,
  UNHIGHLIGHT_PREREQS,
  EDIT_SETTINGS,
  EDIT_SETTINGS_FAILURE,
  LINK_FACEBOOK,
  LINK_FACEBOOK_FAILURE,
  UNLINK_FACEBOOK,
  UNLINK_FACEBOOK_FAILURE,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAILURE,
  UPDATE_COURSE_CLASSES,
  // Prefetch data
  UPDATE_COURSE_METADATA,
  UPDATE_COURSE_METADATA_ERROR,
  UPDATE_PROF_METADATA,
  UPDATE_PROF_METADATA_ERROR,
} from './actions';

function sideBarOpen(state = false, action) {
  switch (action.type) {
  case TOGGLE_SIDEBAR:
    return !state;
  case SET_USER:
  case LOGIN_USER:
    return true;
  case LOGOUT_USER:
  case DELETE_ACCOUNT_SUCCESS:
    return false;
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
  case CREATE_SNACK: {
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
  }
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
  case DELETE_ACCOUNT_SUCCESS:
    return [];
  case UPDATE_USER_COURSES:
    return action.meta.courseList || state;
  case UPDATE_USER_COURSES_PREREQS:
    return action.payload || state;
  default:
    return state;
  }
}

// Helper function for myCourses
// formats courseList into myCourses format of:
/*
	{
		subject: {
			catalogNumber: [prereqs]
		}
	}
*/
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

// Object of courses in My Courses
// Used for determining if user has taken a certain course (hashmap)
// Format:
/*
	{
		subject: {
			catalogNumber: [prereqs]
		}
	}
*/
function myCourses(state = {}, action) {
  switch (action.type) {
  case SET_USER:
    if (action.user == null) return {};
    return getMyCourses(action.user.courseList);
  case LOGIN_USER:
    if (action.payload == null) return {};
    return getMyCourses(action.payload.courseList) || state;
  case LOGOUT_USER:
  case DELETE_ACCOUNT_SUCCESS:
    return {};
  case UPDATE_USER_COURSES:
    return getMyCourses(action.meta.courseList);
  case UPDATE_USER_COURSES_PREREQS:
    return getMyCourses(action.payload) || state;
  default:
    return state;
  }
}

function mySchedule(state = {}, action) {
  switch (action.type) {
  case SET_USER:
    if (action.user == null) return {};
    return action.user.schedule || {};
  case LOGIN_USER:
    if (action.payload == null) return {};
    return action.payload.schedule || state;
  case LOGOUT_USER:
  case DELETE_ACCOUNT_SUCCESS:
    return {};
  case UPDATE_USER_SCHEDULE:
    return action.payload.schedule || state;
  case UPDATE_USER_SCHEDULE_FAILURE:
    toast.error('Failed to update schedule. Please contact an administrator.');
    return state;
  case CLEAR_USER_SCHEDULE:
    return {};
  case CLEAR_USER_SCHEDULE_FAILURE:
    toast.error('Failed to clear schedule. Please contact an administrator.');
    return state;
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
  case DELETE_ACCOUNT_SUCCESS:
    return [];
  case SET_CART:
  case REORDER_CART:
    return action.meta.cart || state;
  case SET_CART_PREREQS:
    return action.payload || state;
  default:
    return state;
  }
}

// TODO: Implement WATCH_CLASS_FAILURE and UNWATCH_CLASS_FAILURE
function watchlist(state = {}, action) {
  switch (action.type) {
  case SET_USER:
    if (action.user == null) return {};
    return action.user.watchlist || state;
  case LOGIN_USER:
    if (action.payload == null) return {};
    return action.payload.watchlist || state;
  case LOGOUT_USER:
  case DELETE_ACCOUNT_SUCCESS:
    return {};
  case WATCH_CLASS: {
    const watchlist = Object.assign({}, state);
    if (!watchlist.hasOwnProperty(action.meta.term)) watchlist[action.meta.term] = {};
    watchlist[action.meta.term][action.meta.classNum] = true;
    return watchlist;
  }
  case UNWATCH_CLASS: {
    const watchlist = Object.assign({}, state);
    if (!watchlist.hasOwnProperty(action.meta.term)) return state;
    if (!watchlist[action.meta.term].hasOwnProperty(action.meta.classNum)) return state;
    delete watchlist[action.meta.term][action.meta.classNum];
    // Delete empty term
    if (Object.keys(watchlist[action.meta.term]).length === 0) delete watchlist[action.meta.term];
    return watchlist;
  }
  default:
    return state;
  }
}

const defaultUser = { username: '', name: '' };

function user(state = defaultUser, action) {
  switch (action.type) {
  case SET_USER:
    action.user.username = action.username;
    return action.user || defaultUser;
  case LOGIN_USER:
    return action.payload || defaultUser;
  case LOGOUT_USER:
  case DELETE_ACCOUNT_SUCCESS:
    if (!window.hasOwnProperty('isServer')) document.cookie = 'watsmymajor_jwt=; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    return defaultUser;
  case DELETE_ACCOUNT_FAILURE:
    toast.error('Failed to delete account. Please contact an administrator.')
    return state;
  case EDIT_SETTINGS:
    return Object.assign({}, state, action.meta.user);
  case EDIT_SETTINGS_FAILURE: {
    const ERROR_WRONG_PASSWORD = 105;
    const { code } = action.payload.response;
    switch (code) {
    case ERROR_WRONG_PASSWORD:
      toast.error('Incorrect password.', { autoClose: 2000 });
      break;
    default:
      toast.error('Failed to update settings.  Please contact an administrator.');
    }
    return state;
  }
  case LINK_FACEBOOK:
  case UNLINK_FACEBOOK: {
    const user = action.payload;
    if (!user) return state;
    user.username = action.meta.username;
    return user;
  }
  case LINK_FACEBOOK_FAILURE:
    toast.error('Failed to link Facebook.  Please contact an administrator.');
    return state;
  case UNLINK_FACEBOOK_FAILURE:
    toast.error('Failed to unlink Facebook.  Please contact an administrator.');
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
  case DELETE_ACCOUNT_SUCCESS:
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

function courseMetadata(state = {}, action) {
  switch (action.type) {
  case UPDATE_COURSE_METADATA:
    return action.payload || state;
  case UPDATE_COURSE_METADATA_ERROR:
    return { err: true };
  default:
    return state;
  }
}

function courseClasses(state = [], action) {
  switch (action.type) {
  case UPDATE_COURSE_CLASSES:
    return action.payload || state;
  default:
    return state;
  }
}

function profMetadata(state = {}, action) {
  let info = null;
  const courses = [];
  switch (action.type) {
  case UPDATE_PROF_METADATA:
    info = action.payload;
    if (info == null) return state;
    Object.keys(info.courses).forEach(subject => {
      Object.keys(info.courses[subject]).forEach(catalogNumber => {
        courses.push({ subject, catalogNumber });
      });
    });
    info.courses = courses;
    return info;
  case UPDATE_PROF_METADATA_ERROR:
    return { error: true };
  default:
    return state;
  }
}

const reducers = combineReducers({
  sideBarOpen,
  snack,
  courseList,
  myCourses,
  mySchedule,
  cart,
  watchlist,
  user,
  isLoggedIn,
  courseCardPrereqs,
  courseMetadata,
  courseClasses,
  profMetadata,
});

export default reducers;

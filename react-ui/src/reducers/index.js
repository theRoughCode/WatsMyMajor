import { combineReducers } from 'redux'
import {
  TOGGLE_SIDEBAR,
  SET_COURSE,
  SET_VIEW
} from '../actions/index';
import { DASHBOARD_VIEW, COURSE_VIEW } from '../constants/views';

function view(state = COURSE_VIEW, action) {
  switch (action.type) {
    case SET_VIEW:
      return action.view;
    default:
      return state;
  }
}

function course(state = {}, action) {
  switch(action.type) {
    case SET_COURSE:
      return action.course;
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

const reducers = combineReducers({
  view,
  course,
  sideBarOpen
})

export default reducers;

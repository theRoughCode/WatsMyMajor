/*
 * action types
 */

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const SET_COURSE = 'SET_COURSE';
export const SET_VIEW = 'SET_VIEW';

/*
 * action creators
 */

export function toggleSideBar() {
  return { type: TOGGLE_SIDEBAR };
}

export function setCourse(subject, catalogNumber) {
  return {
    type: SET_COURSE,
    course: {
      subject,
      catalogNumber
    }
  };
}

export function setView(view) {
  return { type: SET_VIEW, view };
}

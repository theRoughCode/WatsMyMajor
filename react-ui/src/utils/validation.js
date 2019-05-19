const MISSING_FIELD_ERROR = 'This field is required';
const TOO_SHORT_ERROR = (number) => `Must be at least ${number} characters long`;
const WHITESPACE_ERROR = 'Must not have white space';
const WATERLOO_EMAIL_ERROR = 'Has to be a UWaterloo email address';
const PASSWORD_MISMATCH_ERROR = 'Passwords do not match';

export const EMAIL_REGEX = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const UWATERLOO_EMAIL_REGEX = new RegExp(/.+@(edu.)?uwaterloo.ca/g);

export const validateUsername = (username) => {
  if (!username) return MISSING_FIELD_ERROR;
  if (username.length < 6) return TOO_SHORT_ERROR(6);
  if (/\s/g.test(username)) return WHITESPACE_ERROR;
  return '';
};

export const validateName = (name) => {
  if (!name) return MISSING_FIELD_ERROR;
  return '';
}

export const validateEmail = (email) => {
  if (!email) { return MISSING_FIELD_ERROR; }
  if (!EMAIL_REGEX.test(email) || !UWATERLOO_EMAIL_REGEX.test(email)) { return WATERLOO_EMAIL_ERROR; }
  return '';
}

export const validatePassword = (password) => {
  if (!password) return MISSING_FIELD_ERROR;
  if (password.length < 6) return TOO_SHORT_ERROR(6);
  if (/\s/g.test(password)) return WHITESPACE_ERROR;
  return '';
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return MISSING_FIELD_ERROR;
  if (password !== confirmPassword) return PASSWORD_MISMATCH_ERROR;
  return '';
}

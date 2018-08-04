const MISSING_FIELD_ERROR = 'This field is required';
const TOO_SHORT_ERROR = (number) => `Must be at least ${number} characters long`;
const WHITESPACE_ERROR = 'Must not have white space';
const WATERLOO_EMAIL_ERROR = 'Has to be a UWaterloo email address';
const PASSWORD_MISMATCH_ERROR = 'Passwords do not match';
const INVALID_KEY_ERROR = 'Invalid beta key';

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
  if (!(/.+@(edu.)?uwaterloo.ca/g.test(email))) return WATERLOO_EMAIL_ERROR;
  return '';
}

export const validatePassword = (password) => {
  if (password.length < 6) return TOO_SHORT_ERROR(6);
  if (/\s/g.test(password)) return WHITESPACE_ERROR;
  return '';
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) return PASSWORD_MISMATCH_ERROR;
  return '';
}

export const validateBetaKey = (key) => {
  if (key !== process.env.REACT_APP_BETA_KEY) return INVALID_KEY_ERROR;
  return '';
}

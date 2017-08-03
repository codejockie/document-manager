import bcrypt from 'bcryptjs';
import moment from 'moment';

/**
 * @description formats a date using moment.js
 * @function
 * @param {string} date The date to format
 * @returns {Date} Date
 */
export function formatDate(date) {
  if (date) {
    return moment(date).format('ddd, MMM Do YYYY, h:mm:ss a');
  }
  return '';
}

/**
 * @description creates errors in Object format
 * @function
 * @param {Array} errors The caught errors during validation
 * @returns {Object} errors
 */
export function generateErrors(errors) {
  const response = { errors: {} };
  errors.forEach((error) => {
    response.errors[error.param] = error.msg;
  });

  return response;
}

/**
 * @description hashes supplied password
 * @function
 * @param {string} password The user's password to be hashed
 * @returns {string} hashed password
 */
export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(13);
  return bcrypt.hashSync(password, salt);
}

/**
 * @description checks if a user has admin privileges
 * @function
 * @param {Object} userRoleId The user's id
 * @returns {boolean} true/false
 */
export function isAdmin(userRoleId) {
  return userRoleId === 1;
}

/**
 * @description checks for equality of two IDs
 * @function
 * @param {Object} id The document/user stored in the database id
 * @param {Object} userId The user's id
 * @returns {boolean} true/false
 */
export function isUser(id, userId) {
  return id === userId;
}

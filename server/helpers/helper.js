import bcrypt from 'bcrypt';
import moment from 'moment';

/**
 * Formats a date using moment.js
 * @param {string} date The date to format
 * @returns {Date} Date
 */
export function formatDate(date) {
  if (date) {
    return moment(date).format('ddd, MMM Do YYYY, h:mm:ss a');
  }
}

/**
 * Generates document object response
 * @param {Object} document The document sent from the controller
 * @returns {Object} response
 */
export function generateDocumentObject(document) {
  return {
    id: document.id,
    title: document.title,
    content: document.content,
    author: document.author,
    access: document.access,
    userId: document.userId,
    roleId: document.roleId,
    createdAt: document.createdAt,
  };
}

/**
 * Creates errors in Object format
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
 * Generates role object response
 * @param {Object} role The role sent from the controller
 * @returns {Object} response
 */
export function generateRoleObject(role) {
  return {
    id: role.id,
    name: role.name,
    createdAt: role.createdAt
  };
}

/**
 * Generates user object response
 * @param {Object} user The user sent from the controller
 * @returns {Object} response
 */
export function generateUserObject(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    roleId: user.roleId,
    createdAt: user.createdAt,
  };
}

/**
 * Hashes supplied password
 * @param {string} password The user's password to be hashed
 * @param {boolean} isUpdate Set to true when updating a user
 * @returns {String | Promise} hashed password
 */
export function hashPassword(password, isUpdate = false) {
  const saltRounds = 13;
  if (isUpdate) return bcrypt.hashSync(password, saltRounds);
  return bcrypt.hash(password, saltRounds);
}

/**
 * Checks if a user has admin privileges
 * @param {Object} userRoleId The user's role id
 * @returns {boolean} true/false
 */
export function isAdmin(userRoleId) {
  return userRoleId === 1;
}

/**
 * Checks for equality of two IDs
 * @param {Object} id The document/user stored in the database id
 * @param {Object} userId The user's id
 * @returns {boolean} true/false
 */
export function isUser(id, userId) {
  return id === userId;
}

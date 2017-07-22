import bcrypt from 'bcryptjs';

/**
 * @description checks for equality of two IDs
 * @function
 * @param {Object} objectId The object's id
 * @param {Object} userId The user's id
 * @returns {boolean} true/false
 */
export function isEqual(objectId, userId) {
  return objectId === userId;
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

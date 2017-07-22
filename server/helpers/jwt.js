import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = require('../models/index').User;

/**
 * @description finds a user by supplied credentials
 * @function
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @returns {Object} user
 */
export function findByCredentials(email, password) {
  return User.findOne({
    where: {
      email
    }
  })
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
}

/**
 * @description finds a user by token
 * @function
 * @param {string} token The user's token stored in the DB
 * @returns {Object} user
 */
export function findByToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
    return User.findOne({
      where: {
        $and: [{
          id: decoded.id
        }, {
          email: decoded.email
        }, {
          username: decoded.username
        }]
      }
    });
  } catch (error) {
    return Promise.reject();
  }
}

/**
 * @description generates a jwt token for authentication
 * @function
 * @param {string} id User's id stored in the DB
 * @param {string} email User's email stored in the DB
 * @param {string} username User's username stored in the DB
 * @returns {string} jwt token
 */
export function generateAuthToken(id, email, username) {
  return jwt.sign({
    id,
    email,
    username
  }, process.env.SECRET, { expiresIn: '72 hours' });
}

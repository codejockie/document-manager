import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';

const User = models.User;

/**
 * Finds a user by supplied credentials
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @returns {Object} user
 */
export function findByEmailAndPassword(email, password) {
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
 * Finds a user by token
 * @param {string} token The user's token stored in the database
 * @returns {Object} user
 */
export function findByToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
    return User.findOne({
      where: {
        $or: [{
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
 * Generates jwt token for authentication
 * @param {string} id User's id stored in the database
 * @param {string} email User's email stored in the database
 * @param {string} username User's username stored in the database
 * @returns {string} jwt token
 */
export function generateAuthToken(id, email, username) {
  return jwt.sign({
    id,
    email,
    username
  }, process.env.SECRET, { expiresIn: '72 hours' });
}

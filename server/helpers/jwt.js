import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import models from '../models';

const { User } = models;

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

      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return Promise.reject();
          }
          return Promise.resolve(user);
        })
        .catch(() => Promise.reject());
    });
}

/**
 * Finds a user by token
 * @param {string} token The user's token stored in the database
 * @returns {Object} user
 */
export function findByToken(token) {
  try {
    const decoded = verify(token, process.env.SECRET);
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
    return Promise.reject(error);
  }
}

/**
 * Generates jsonwebtoken token for authentication
 * @param {string} id User's id stored in the database
 * @param {string} email User's email stored in the database
 * @param {string} username User's username stored in the database
 * @returns {string} jsonwebtoken token
 */
export function generateAuthToken(id, email, username) {
  return sign({
    id,
    email,
    username
  }, process.env.SECRET, { expiresIn: '72 hours' });
}

/**
 * Verify jsonwebtoken token to check if it is valid
 * @param {string} token jsonwebtoken token
 * @returns {Object} valid or not valid state
 */
export function verifyToken(token) {
  const status = {
    error: '',
    ok: false
  };

  try {
    const decoded = verify(token, process.env.SECRET);

    if (decoded) {
      status.ok = true;
      return status;
    }
  } catch (error) {
    const { name } = error;

    switch (name) {
      case 'TokenExpiredError':
        status.error = 'Token expired';
        return status;
      case 'JsonWebTokenError':
        status.error = 'Invalid token signature';
        return status;
      default:
        return status;
    }
  }
}

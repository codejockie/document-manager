import passport from 'passport';

import models from '../models';
import { generateErrors } from '../helpers/helper';
import '../services/passport';

const { Document, Role, User } = models;

const authenticate = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

/**
 * Checks if a document can be found by its id
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {void}
 */
const findDocumentById = (req, res, next) => {
  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          message: 'Document not found'
        });
      }

      next();
    })
    .catch(() => res.status(500).send({
      message: 'Invalid ID'
    }));
};

/**
 * Checks if a role can be found by its id
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {void}
 */
const findRoleById = (req, res, next) => {
  Role.findById(req.params.id)
    .then((role) => {
      if (!role) {
        return res.status(404).send({
          message: 'Role not found'
        });
      }

      next();
    })
    .catch(() => res.status(500).send({
      message: 'Invalid ID'
    }));
};

/**
 * Checks if a user can be found by its id
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {void}
 */
const findUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }

      next();
    })
    .catch(() => res.status(500).send({
      message: 'Invalid ID'
    }));
};

/**
 * Checks if an authenticated user is an admin
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {Response} message
 */
const isAdministrator = (req, res, next) => {
  if (req.user.roleId !== 1) {
    return res.status(403).send({
      message: 'The resource you are looking for does not exist'
    });
  }

  next();
};

/**
 * Validates inputs for document creation
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateDocument = (req, res, next) => {
  req.checkBody('title', 'Title must be at least five characters long').isLength({ min: 5 });
  req.checkBody('content', 'Content is required').notEmpty();
  req.checkBody('access', 'Access is required').notEmpty();
  req.checkBody('access', 'Access must be a string').isAlpha();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(generateErrors(errors));
  }
  next();
};

/**
 * Validates limit and offset if they are provided
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json error response
 */
const validateLimitAndOffset = (req, res, next) => {
  const { limit, offset } = req.query;
  if (limit && !Number.isInteger(Number(limit))) {
    return res.status(400).send({
      message: 'Limit must be an integer'
    });
  }

  if (offset && !Number.isInteger(Number(offset))) {
    return res.status(400).send({
      message: 'Offset must be an integer'
    });
  }

  next();
};

/**
 * Validates login fields
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateLogin = (req, res, next) => {
  req.checkBody('email', 'Email must be valid').isEmail();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(generateErrors(errors));
  }
  next();
};

/**
 * Validates input param in the url
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateParam = (req, res, next) => {
  if (Number.isNaN((Number(req.params.id)))) {
    return res.status(400).send({
      message: 'Param must be a number'
    });
  }
  next();
};

/**
 * Validates search query param in the url
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateQuery = (req, res, next) => {
  const { q } = req.query;
  if (q === undefined || q === '') {
    return res.status(400).send({
      message: 'Query param is required'
    });
  }
  next();
};

/**
 * Validates input for role creation
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateRole = (req, res, next) => {
  req.checkBody('name', 'Name can only contain letters').isAlpha();
  req.checkBody('name', 'Name cannot be empty').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(generateErrors(errors));
  }
  next();
};

/**
 * Validates inputs for user creation
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
const validateUser = (req, res, next) => {
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('username', 'Username cannot contain number').isAlpha();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('firstname', 'Firstname cannot contain number').isAlpha();
  req.checkBody('firstname', 'Firstname is required').notEmpty();
  req.checkBody('lastname', 'Lastname cannot contain number').isAlpha();
  req.checkBody('lastname', 'Lastname is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(generateErrors(errors));
  }
  next();
};

export {
  authenticate,
  isAdministrator,
  findDocumentById,
  findRoleById,
  findUserById,
  requireSignin,
  validateDocument,
  validateLimitAndOffset,
  validateLogin,
  validateParam,
  validateQuery,
  validateRole,
  validateUser
};

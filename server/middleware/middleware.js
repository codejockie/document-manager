import models from '../models';
import { generateErrors } from '../helpers/helper';
import { findByToken } from '../helpers/jwt';

const Document = models.Document;
const Role = models.Role;
const User = models.User;

export default {
  /**
   * @description checks if a user is authenticated
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   */
  authenticate(req, res, next) {
    const token = req.headers['x-auth'];

    if (!token) {
      return res.status(401).send({ message: 'Unauthorised user' });
    }

    findByToken(token)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
      })
      .catch(() => res.status(401).send({ error: 'Unauthorised user' }));
  },
  /**
   * @description checks if a document can be found by its id
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   */
  findDocumentById(req, res, next) {
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
  },
  /**
   * @description checks if a role can be found by its id
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   */
  findRoleById(req, res, next) {
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
  },
  /**
   * @description checks if a user can be found by its id
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   */
  findUserById(req, res, next) {
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
  },
  /**
   * @description checks if an authenticated user is an admin
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {Response} message
   */
  isAdministrator(req, res, next) {
    if (req.user.roleId !== 1) {
      return res.status(403).send({
        message: 'The resource you are looking for does not exist'
      });
    }

    next();
  },
  /**
   * @description validates inputs for document creation
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateDocument(req, res, next) {
    req.checkBody('title', 'Title must be at least five characters long').isLength({ min: 5 });
    req.checkBody('content', 'Content is required').notEmpty();
    req.checkBody('access', 'Access is required').notEmpty();
    req.checkBody('access', 'Access must be a string').isAlpha();

    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json(generateErrors(errors));
    }
    next();
  },
  /**
   * @description validates limit and offset if they are provided
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json error response
   */
  validateLimitAndOffset(req, res, next) {
    if (req.query.limit) {
      if (!Number.isInteger(Number(req.query.limit))) {
        return res.status(400).send({
          message: 'Limit must be an integer'
        });
      }
    }

    if (req.query.offset) {
      if (!Number.isInteger(Number(req.query.offset))) {
        return res.status(400).send({
          message: 'Offset must be an integer'
        });
      }
    }

    next();
  },
  /**
   * @description validates login fields
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateLogin(req, res, next) {
    req.checkBody('email', 'Email must be valid').isEmail();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json(generateErrors(errors));
    }
    next();
  },
  /**
   * @description validates input param in the url
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateParam(req, res, next) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'Param must be a number'
      });
    }
    next();
  },
  /**
   * @description validates search query param in the url
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateQuery(req, res, next) {
    if (req.query.q === undefined || req.query.q === '') {
      return res.status(400).send({
        message: 'Query param is required'
      });
    }
    next();
  },
  /**
   * @description validates input for role creation
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateRole(req, res, next) {
    req.checkBody('name', 'Name can only contain letters').isAlpha();
    req.checkBody('name', 'Name cannot be empty').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json(generateErrors(errors));
    }
    next();
  },
  /**
   * @description validates inputs for user creation
   * @function
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {json} json response containing the errors if any
   */
  validateUser(req, res, next) {
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
  }
};

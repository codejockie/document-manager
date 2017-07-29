import { findByToken } from './jwt';

/**
 * @description checks if a user is authenticated
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {void}
 */
export function authenticate(req, res, next) {
  const token = req.headers['x-auth'];

  if (!token) {
    return res.status(401).send({
      status: 'error',
      message: 'Unauthorised user'
    });
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
}

/**
 * @description validates inputs for document creation
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
export function validateDocument(req, res, next) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  req.checkBody('access', 'Access is required').notEmpty();
  req.checkBody('access', 'Access must be a string').isAlpha();

  const errors = req.validationErrors();

  if (errors) {
    const response = { errors: {} };
    errors.forEach((error) => {
      response.errors[error.param] = error.msg;
    });

    return res.status(400).json(response);
  }
  next();
}

/**
 * @description validates login fields
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
export function validateLogin(req, res, next) {
  req.checkBody('email', 'Email must be valid').isEmail();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const response = { errors: {} };
    errors.forEach((error) => {
      response.errors[error.param] = error.msg;
    });

    return res.status(400).json(response);
  }
  next();
}

/**
 * @description validates input param in the url
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
export function validateParam(req, res, next) {
  req.checkParams('id', 'Invalid url param').isNumeric();

  const errors = req.validationErrors();
  if (errors) {
    const response = { errors: {} };
    errors.forEach((error) => {
      response.errors[error.param] = error.msg;
    });

    return res.status(400).json(response);
  }
  next();
}

/**
 * @description validates inputs for user creation
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {callback} next
 * @returns {json} json response containing the errors if any
 */
export function validateUser(req, res, next) {
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('username', 'Username cannot contain number').isAlpha();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('firstname', 'Firstname cannot contain number').isAlpha();
  req.checkBody('firstname', 'Firstname is required').notEmpty();
  req.checkBody('lastname', 'Lastname cannot contain number').isAlpha();
  req.checkBody('lastname', 'Lastname is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('roleId', 'Role ID must be an integer').isNumeric();
  req.checkBody('roleId', 'Role ID is required').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const response = { errors: {} };
    errors.forEach((error) => {
      response.errors[error.param] = error.msg;
    });

    return res.status(400).json(response);
  }
  next();
}


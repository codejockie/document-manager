import express from 'express';
import _ from 'lodash';
import { formatDate, hashPassword, isAdmin, isUser } from '../helpers/helper';
import { findByCredentials, generateAuthToken } from '../helpers/jwt';
import { authenticate, validateLogin, validateUser } from '../helpers/middleware';

const router = express.Router();
const User = require('../models/index').User;
const Document = require('../models/index').Document;

router.post('/login', validateLogin, (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  findByCredentials(body.email, body.password)
    .then((user) => {
      const token = generateAuthToken(user.id, user.email, user.username);
      res.header('X-Auth', token).send({
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          created_at: user.createdAt,
          role_id: user.roleId
        },
        token
      });
    })
    .catch(() => res.status(404).send({
      status: 'error',
      message: 'Username or Password incorrect'
    }));
});

router.post('/logout', (req, res) => {
  req.user = null;
  req.token = null;
  res.header('X-Auth', '').status(200).send({ message: 'Logged out' });
});

router.post('/', validateUser, (req, res) => {
  User.findOne({
    where: {
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    }
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        status: 'error',
        message: 'username and email must be unique'
      });
    }

    User.create({
      email: req.body.email,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashPassword(req.body.password),
      roleId: req.body.roleId
    })
      .then((newUser) => {
        const token = generateAuthToken(newUser.id, newUser.email, newUser.username);
        res.header('X-Auth', token).status(201).send({
          message: 'Registration was successful',
          token
        });
      })
      .catch(error => res.status(400).json({
        status: 'error',
        message: 'Registration failed',
        error
      }));
  });
});

router.get('/', authenticate, (req, res) => {
  let options;
  if ((req.query.limit !== undefined && req.query.limit !== '')
    && (req.query.offset !== undefined && req.query.offset !== '')) {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10);
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).send({
        status: 'error',
        message: 'Limit and Offset params must be numbers'
      });
    }

    options = {
      offset,
      limit,
    };
  } else {
    options = {};
  }

  if (!isAdmin(req.user.id)) {
    return res.status(401).send({
      status: 'error',
      message: 'This page is restricted to administrators only'
    });
  }


  User.findAll(options)
    .then(users => res.status(200).send({
      status: 'ok',
      count: users.length,
      data: users.map(user => (
        {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          created_at: formatDate(user.createdAt)
        }))
    }));
});

router.get('/:id', authenticate, (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Param must be a number'
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.status(200).json({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        created_at: formatDate(user.createdAt)
      });
    })
    .catch(error => res.status(400).send(error));
});

router.get('/:id/documents', (req, res) => {
  if (isNaN(parseInt(req.params.id, 10))) {
    return res.status(400).send({
      status: 'error',
      message: 'Param must be a number'
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
      }

      Document.findAll({
        where: {
          userId: req.params.id,
          roleId: user.roleId
        }
      })
        .then((documents) => {
          if (documents.length === 0) {
            return res.status(404).send({
              status: 'ok',
              message: 'No document found for this user'
            });
          }
          return res.status(200).json(documents.map(document => (
            {
              id: document.id,
              title: document.title,
              content: document.content,
              author: document.author,
              access: document.access,
              userId: document.userId,
              roleId: document.roleId,
              created_at: formatDate(document.createdAt),
              updated_at: formatDate(document.updatedAt)
            }
          )));
        });
    })
    .catch(error => res.status(400).send(error));
});

router.put('/:id', authenticate, (req, res) => {
  if (isNaN(parseInt(req.params.id, 10))) {
    return res.status(400).send({
      status: 'error',
      message: 'Param must be a number'
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!isUser(user.id, req.user.id) && !isAdmin(req.user.roleId)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to update this user'
        });
      }

      User.findAll({
        where: {
          $or: [{
            email: req.body.email
          }, {
            username: req.body.username
          }]
        }
      })
        .then((existingUser) => {
          if (existingUser.length !== 0
            && (existingUser[0].dataValues.id !== parseInt(req.params.id, 10))) {
            return res.status(400).send({
              status: 'error',
              message: 'A user exist with same email or username'
            });
          }

          return user.update({
            email: req.body.email || user.email,
            username: req.body.username || user.username,
            firstname: req.body.firstname || user.firstname,
            lastname: req.body.lastname || user.lastname,
            password: req.body.password ? hashPassword(req.body.password) : user.password,
            roleId: isAdmin(req.user.roleId) ? req.body.roleId : user.roleId
          })
            .then(() => res.status(200).send({
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              username: user.username,
              created_at: formatDate(user.createdAt),
              role_id: user.roleId
            }));
        });
    })
    .catch(error => res.status(400).send(error));
});

router.delete('/:id', authenticate, (req, res) => {
  if (isNaN(parseInt(req.params.id, 10))) {
    return res.status(400).send({
      status: 'error',
      message: 'Param must be a number'
    });
  }

  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!isAdmin(req.user.roleId) && !isUser(user.id, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to delete this user'
        });
      }

      return user.destroy()
        .then(() => res.status(200).json({
          status: 'ok',
          message: 'User deleted successfully'
        }));
    })
    .catch(error => res.status(400).send(error));
});

export default router;

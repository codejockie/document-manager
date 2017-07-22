import express from 'express';
import _ from 'lodash';
import { hashPassword, isEqual } from '../helpers/helper';
import { findByCredentials, generateAuthToken } from '../helpers/jwt';
import { authenticate, validateUser } from '../helpers/middleware';

const router = express.Router();
const User = require('../models/index').User;
const Document = require('../models/index').Document;

router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  findByCredentials(body.email, body.password)
    .then((user) => {
      const token = generateAuthToken(user.id, user.email, user.username);
      res.header('X-Auth', token).send({
        user,
        token
      });
    })
    .catch(error => res.status(404).send(error));
});

router.post('/logout', (req, res) => {
  req.user = null;
  req.token = null;
  res.header('X-Auth', '');
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
        res.header('X-Auth', token).send({
          data: newUser,
          token
        });
      })
      .catch(error => res.status(400).json({
        status: 'error',
        message: 'Unable to save',
        error
      }));
  });
});

router.get('/', (req, res) => {
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

  User.findAll(options)
    .then((users) => {
      if (users.length === 0) {
        return res.status(200).send({
          status: 'ok',
          message: 'No users found'
        });
      }
      return res.status(200).send({
        status: 'ok',
        count: users.length,
        data: users
      });
    })
    .catch(error => res.status(400).send(error));
});

router.get('/:id', (req, res) => {
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

      res.status(200).json(user);
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
          access: 'public',
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
          return res.status(200).json(documents);
        })
        .catch(error => res.status(400).send(error));
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

      if (!isEqual(user.id, req.user.id)) {
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

          let password;
          if (req.body.password !== undefined && req.body.password !== '') {
            password = hashPassword(req.body.password);
          }

          return user.update({
            email: req.body.email || user.email,
            username: req.body.username || user.username,
            firstname: req.body.firstname || user.firstname,
            lastname: req.body.lastname || user.lastname,
            password: password || user.password,
            roleId: req.body.roleId || user.roleId
          })
            .then(() => res.status(201).send({
              status: 'ok',
              data: user
            }))
            .catch(error => res.status(400).send(error));
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

      if (!isEqual(user.id, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to delete this user'
        });
      }

      return user.destroy()
        .then(() => res.status(200).json({
          status: 'ok',
          message: 'User deleted successfully'
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
});

export default router;

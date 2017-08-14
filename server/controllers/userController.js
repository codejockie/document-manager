import lodash from 'lodash';
import models from '../models';
import { generateDocumentObject, hashPassword, isAdmin, isUser, generateUserObject } from '../helpers/helper';
import { findByEmailAndPassword, generateAuthToken } from '../helpers/jwt';
import paginate from '../helpers/paginate';

const User = models.User;
const Document = models.Document;
const serverErrorMessage = 'An error occurred while processing the request';

export default {
  /**
   * @description logs a user in
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  login(req, res) {
    const body = lodash.pick(req.body, ['email', 'password']);

    findByEmailAndPassword(body.email, body.password)
      .then((user) => {
        const token = generateAuthToken(user.id, user.email, user.username);
        res.header('X-Auth', token).send({
          user: generateUserObject(user),
          token
        });
      })
      .catch(() => res.status(401).send({
        message: 'Username or Password incorrect'
      }));
  },
  /**
   * @description logs out a user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { void }
   */
  logout(req, res) {
    req.user = null;
    req.token = null;
    res.header('X-Auth', '').status(200).send({ message: 'Logged out' });
  },
  /**
   * @description creates a new user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  create(req, res) {
    User.findOne({
      where: {
        $or: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    }).then((user) => {
      if (user) {
        return res.status(422).send({
          message: 'username and email must be unique'
        });
      }

      User.create({
        email: req.body.email,
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hashPassword(req.body.password),
        roleId: 2
      })
        .then((newUser) => {
          const token = generateAuthToken(newUser.id, newUser.email, newUser.username);
          res.header('X-Auth', token).status(201).send({
            user: generateUserObject(newUser),
            token
          });
        })
        .catch(() => res.status(500).send({
          message: serverErrorMessage
        }));
    });
  },
  /**
   * @description retrieves all users
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } users
   */
  getAll(req, res) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    User.findAll({
      offset,
      limit,
    })
      .then((users) => {
        res.status(200).send({
          metaData: paginate(limit, offset, users.length),
          users: users.map(user => generateUserObject(user)),
        });
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description retrieves a user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  getOne(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        // ensures a user only has access to his own account
        if (!isUser(user.id, req.user.id) && !isAdmin(req.user.roleId)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to access this user"
          });
        }

        res.status(200).send(generateUserObject(user));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description gets a user's documents
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } documents
   */
  getUserDocuments(req, res) {
    const options = {
      attributes: {
        exclude: ['roleId']
      }
    };

    const role = req.user.roleId;

    if (role === 1) {
      options.where = { userId: req.params.id };
    } else {
      options.where = {
        userId: req.params.id,
        access: 'public'
      };
    }

    options.offset = req.query.offset || 0;
    options.limit = req.query.limit || 10;

    Document.findAll(options)
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).send({
            message: 'No document found for this user'
          });
        }

        return res.status(200).send({
          metaData: paginate(options.limit, options.offset, documents.length),
          documents: documents.map(document => (generateDocumentObject(document)))
        });
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description updates a user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  update(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        if (!isUser(user.id, req.user.id) && !isAdmin(req.user.roleId)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to update this user"
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
              return res.status(422).send({
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
              .then(() => res.status(200).send(generateUserObject(user)))
              .catch(() => res.status(500).send({ message: 'No role with that ID' }));
          })
          .catch(() => res.status(500).send({
            message: serverErrorMessage
          }));
      });
  },
  /**
   * @description deletes a user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } message
   */
  delete(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        if (!isAdmin(req.user.roleId) && !isUser(user.id, req.user.id)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to delete this user"
          });
        }

        return user.destroy()
          .then(() => res.status(200).json({
            message: 'User deleted successfully'
          }));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }
};

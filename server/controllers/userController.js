import _ from 'lodash';
import models from '../models';
import { documentCreator, hashPassword, isAdmin, isUser, userCreator } from '../helpers/helper';
import { findByEmailAndPassword, generateAuthToken } from '../helpers/jwt';
import paginate from '../helpers/paginate';

const User = models.User;
const Document = models.Document;

export default {
  /**
   * @description logs a user in
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  login(req, res) {
    const body = _.pick(req.body, ['email', 'password']);

    findByEmailAndPassword(body.email, body.password)
      .then((user) => {
        const token = generateAuthToken(user.id, user.email, user.username);
        res.header('X-Auth', token).send({
          user: userCreator(user),
          token
        });
      })
      .catch(() => res.status(404).send({
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
  signup(req, res) {
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
            user: userCreator(newUser),
            token
          });
        });
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
    User.findAll()
      .then((response) => {
        const totalCount = response.length;
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10;
        return User.findAll({
          offset,
          limit,
        })
          .then(users => res.status(200).send({
            metaData: paginate(limit, offset, totalCount),
            users: users.map(user => userCreator(user)),
          }));
      });
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
        res.status(200).json({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        });
      });
  },
  /**
   * @description gets a user's documents
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } documents
   */
  getUserDocuments(req, res) {
    Document.findAll()
      .then((response) => {
        const totalCount = response.length;
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10;

        return Document.findAll({
          where: {
            userId: req.params.id
          },
          offset,
          limit,
        })
          .then((documents) => {
            if (documents.length === 0) {
              return res.status(404).send({
                message: 'No document found for this user'
              });
            }
            return res.status(200).send({
              metaData: paginate(limit, offset, totalCount),
              documents: documents.map(document => (documentCreator(document)))
            });
          });
      });
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
              .then(() => res.status(200).send(userCreator(user)));
          });
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
      });
  }
};

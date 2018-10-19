import models from '../models';
import paginate from '../helpers/paginate';
import { serverErrorMessage } from '../helpers/messages';
import {
  generateDocumentObject,
  generateUserObject,
  hashPassword,
  isAdmin,
  isUser
} from '../helpers/helper';

const { User, Document } = models;

/**
  * UserController class
  */
export default class UserController {
  /**
   * Retrieves all users
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } users
   */
  static getUsers(req, res) {
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
  }

  /**
   * Retrieves a user
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  static getUser(req, res) {
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
  }

  /**
   * Gets a user's documents
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } documents
   */
  static getUserDocuments(req, res) {
    const options = {
      attributes: {
        exclude: ['roleId']
      }
    };

    if (req.user.roleId === 1) {
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
  }

  /**
   * Updates a user
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  static updateUser(req, res) {
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

            const { password } = req.body;
            return user.update({
              email: req.body.email || user.email,
              username: req.body.username || user.username,
              firstname: req.body.firstname || user.firstname,
              lastname: req.body.lastname || user.lastname,
              password: password ? hashPassword(password, true) : user.password,
              roleId: isAdmin(req.user.roleId) ? req.body.roleId : user.roleId
            })
              .then(() => res.status(200).send(generateUserObject(user)))
              .catch(error => res.status(500).send({ message: error.message }));
          })
          .catch(() => res.status(500).send({
            message: serverErrorMessage
          }));
      });
  }

  /**
   * Deletes a user
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } message
   */
  static deleteUser(req, res) {
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
}

import models from '../models';
import { generateRoleObject } from '../helpers/helper';
import { serverErrorMessage } from '../helpers/messages';

const { Role } = models;

/**
 * @class RoleController
 */
export default class RoleController {
  /**
   * Creates a new role
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  static createRole(req, res) {
    Role.findOne({
      where: {
        name: req.body.name
      }
    })
      .then((role) => {
        if (role) {
          return res.status(422).send({
            message: 'Role name must be unique'
          });
        }

        Role
          .create({
            name: req.body.name
          })
          .then(newRole => res.status(201).send(generateRoleObject(newRole)));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Retrieves all roles
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } roles
   */
  static getRoles(req, res) {
    Role
      .all()
      .then(roles => res.status(200).send({
        roles
      }))
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Retrieves a role
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  static getRole(req, res) {
    Role.findById(req.params.id)
      .then(role => res.status(200).send(generateRoleObject(role)))
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Updates a role
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  static updateRole(req, res) {
    return Role
      .findById(req.params.id)
      .then((role) => {
        Role.findAll({
          where: {
            name: req.body.name
          }
        })
          .then((existingRole) => {
            if (existingRole.length !== 0
              && (existingRole[0].dataValues.id !== parseInt(req.params.id, 10))) {
              return res.status(422).send({
                message: 'A role exist with same name'
              });
            }

            return role.update({
              name: req.body.name
            })
              .then(() => res.status(200).send(generateRoleObject(role)));
          });
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Deletes a role
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } message
   */
  static deleteRole(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully'
          }));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }
}

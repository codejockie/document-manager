import models from '../models';
import { roleCreator } from '../helpers/helper';

const Role = models.Role;

export default {
  create(req, res) {
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
          .then(newRole => res.status(201).send(roleCreator(newRole)));
      });
  },
  getAll(req, res) {
    Role
      .all()
      .then(roles => res.status(200).send({
        roles
      }));
  },
  getOne(req, res) {
    Role.findById(req.params.id)
      .then(role => res.status(200).send(roleCreator(role)));
  },
  update(req, res) {
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
              .then(() => res.status(200).send(roleCreator(role)));
          });
      });
  },
  delete(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully'
          }));
      });
  }
};

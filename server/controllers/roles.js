import models from '../models';

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
          .then(newRole => res.status(201).send({
            id: newRole.id,
            name: newRole.name,
            createdAt: newRole.createdAt
          }));
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
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role not found'
          });
        }

        return res.status(200).send({
          id: role.id,
          name: role.name,
          createdAt: role.createdAt
        });
      })
      .catch(() => res.status(400).send({
        message: 'Invalid ID'
      }));
  },
  update(req, res) {
    return Role
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role not found'
          });
        }

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
              .then(() => res.status(200).send({
                id: role.id,
                name: role.name,
                createdAt: role.createdAt
              }));
          });
      })
      .catch(() => res.status(400).send({
        message: 'Invalid ID'
      }));
  },
  delete(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role not found'
          });
        }

        role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully'
          }));
      })
      .catch(() => res.status(400).send({
        message: 'Invalid ID'
      }));
  }
};

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
import models from '../../server/models';
import { hashPassword } from '../../server/helpers/helper';

const Role = models.Role;
const User = models.User;
const request = supertest.agent(app);
const authToken = process.env.AUTH_TOKEN;
const token = process.env.TOKEN;
const adminRole = 'admin';
const userRole = 'user';
const editorRole = 'editor';

const createUsers = (done) => {
  User.bulkCreate([{
    username: process.env.USERNAME,
    firstname: 'Kennedy',
    lastname: 'John',
    password: hashPassword(process.env.PASSWORD),
    email: process.env.EMAIL,
    roleId: 1
  }, {
    username: 'acedcoder',
    firstname: 'Kennedy',
    lastname: 'John',
    password: hashPassword('test'),
    email: 'devjckennedy@gmail.com',
    roleId: 2
  }]).then(() => {
    done();
  });
};

describe('Roles endpoints', () => {
  beforeEach((done) => {
    User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then((err) => {
        if (!err) {
          Role.destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
          })
            .then((err) => {
              if (!err) {
                Role.bulkCreate([{
                  name: adminRole
                }, {
                  name: userRole
                }]).then((err) => {
                  if (!err) {
                    //
                  }
                  done();
                });
              }
            });
        }
      });
  });

  // POST /v1/roles route
  describe('POST /v1/roles', () => {
    beforeEach((done) => {
      createUsers(done);
    });

    it('should validate request', (done) => {
      const role = {
        name: '',
      };

      request
        .post('/v1/roles')
        .set('X-Auth', authToken)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.name).to.equal('Name cannot be empty');
          done();
        });
    });

    it('should validate non alpha name', (done) => {
      const role = {
        name: 1,
      };

      request
        .post('/v1/roles')
        .set('X-Auth', authToken)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.name).to.equal('Name can only contain letters');
          done();
        });
    });

    it('should check role uniqueness', (done) => {
      const role = {
        name: adminRole,
      };

      request
        .post('/v1/roles')
        .set('X-Auth', authToken)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Role name must be unique');
          done();
        });
    });

    it('should create a new role', (done) => {
      const role = {
        name: editorRole
      };

      request
        .post('/v1/roles')
        .set('X-Auth', authToken)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(editorRole);
          done();
        });
    });
  });

  // GET /v1/roles route
  describe('GET /v1/roles', () => {
    beforeEach((done) => {
      createUsers(done);
    });

    it('successfully retrieves roles', (done) => {
      request
        .get('/v1/roles')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.roles).to.be.an('array');
          expect(res.body.roles[0].name).to.equal(adminRole);
          expect(res.body.roles[1].name).to.equal(userRole);
          done();
        });
    });

    it('should return 403 status for non admins', (done) => {
      request
        .get('/v1/roles')
        .set('X-Auth', token)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('The resource you are looking for does not exist');
          done();
        });
    });
  });

  // GET /v1/roles/:id route
  describe('GET /v1/roles/:id', () => {
    beforeEach((done) => {
      createUsers(done);
    });

    it('retrieves a role by id', (done) => {
      request
        .get('/v1/roles/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.name).to.equal(adminRole);
          done();
        });
    });

    it('returns a 404 status message for non-existing role', (done) => {
      request
        .get('/v1/roles/3')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('returns a 400 status message for invalid param', (done) => {
      request
        .get('/v1/roles/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .get('/v1/roles/10124357878767767857')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/roles/:id route
  describe('PUT /v1/roles/:id', () => {
    beforeEach((done) => {
      createUsers(done);
    });

    it('returns a 400 status for invalid input param', (done) => {
      request
        .put('/v1/roles/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing role', (done) => {
      request
        .put('/v1/roles/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('returns a 422 status for duplicate role', (done) => {
      request
        .put('/v1/roles/1')
        .set('X-Auth', authToken)
        .send({
          name: userRole,
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A role exist with same name');
          done();
        });
    });

    it('updates a role by id', (done) => {
      request
        .put('/v1/roles/1')
        .set('X-Auth', authToken)
        .send({
          name: editorRole,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(editorRole);
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .put('/v1/roles/6900795794579575')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // DELETE /v1/roles/:id route
  describe('DELETE /v1/roles/:id', () => {
    beforeEach((done) => {
      createUsers(done);
    });

    it('returns a 400 status for invalid input param', (done) => {
      request
        .delete('/v1/roles/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing role', (done) => {
      request
        .put('/v1/roles/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('deletes a role by id', (done) => {
      request
        .delete('/v1/roles/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Role deleted successfully');
          done();
        });
    });

    it('given a non-existing role id, it returns a 404 status', (done) => {
      request
        .delete('/v1/roles/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .delete('/v1/roles/101243578787677678575')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });
});

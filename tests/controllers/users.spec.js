import { expect } from 'chai';
import supertest from 'supertest';
import isEmpty from 'lodash/isEmpty';
import app from '../../src/server';
import models from '../../server/models';
import { hashPassword } from '../../server/helpers/helper';

const Document = models.Document;
const User = models.User;
const Role = models.Role;

const request = supertest.agent(app);

const authToken = process.env.AUTH_TOKEN;
const token = process.env.TOKEN;

describe('Users endpoints', () => {
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
                  name: 'admin'
                },
                {
                  name: 'user'
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

  // POST /v1/users/login
  describe('POST /v1/users/login', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
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
    });

    it('should validate login details', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: 'codejockie@',
          password: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(isEmpty(res.body.errors)).to.equal(false);
          expect(res.body.errors.email).to.equal('Email must be valid');
          expect(res.body.errors.password).to.equal('Password is required');
          done();
        });
    });

    it('given non-existing account details, it returns a 404 status', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: 'codejockie@codes.com',
          password: process.env.PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Username or Password incorrect');
          done();
        });
    });

    it('successfully authenticates a user', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: process.env.EMAIL,
          password: process.env.PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('generates a token on successful authentication', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: process.env.EMAIL,
          password: process.env.PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('sets the token on the header with a key of  X-Auth', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: process.env.EMAIL,
          password: process.env.PASSWORD
        })
        .end((err, res) => {
          expect(res.header['x-auth']).to.equal(res.body.token);
          done();
        });
    });

    it('given a wrong password, it throws an error', (done) => {
      request
        .post('/v1/users/login')
        .send({
          email: process.env.EMAIL,
          password: 'test'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Username or Password incorrect');
          done();
        });
    });
  });

  // POST /v1/users/logout
  describe('POST /v1/users/logout', () => {
    it('clears the X-Auth header on logout', (done) => {
      request
        .post('/v1/users/logout')
        .expect(200)
        .end((err, res) => {
          expect(res.header['x-auth']).to.equal('');
          done();
        });
    });
  });

  // GET /v1/users route
  describe('GET /v1/users', () => {
    beforeEach((done) => {
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
    });

    it('validates offset and limit query params', (done) => {
      request
        .get('/v1/users/?limit=cj&offset=0')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Limit and Offset params must be numbers');
          done();
        });
    });

    it('given valid offset and limit, it returns correct data', (done) => {
      request
        .get('/v1/users/?limit=1&offset=0')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.metaData.pageSize).to.equal(1);
          expect(res.body.metaData.totalCount).to.equal(2);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0].firstname).to.equal('Kennedy');
          expect(res.body.users[0].email).to.equal(process.env.EMAIL);
          done();
        });
    });

    it('should return a 401 status on header with no token set', (done) => {
      User.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true
      }).then((err) => {
        if (!err) {
          Role.destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
          }).then(() => {
            //
          });
        }
      });

      request
        .get('/v1/users')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('successfully retrieves users', (done) => {
      request
        .get('/v1/users')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0].firstname).to.equal('Kennedy');
          expect(res.body.users[0].email).to.equal(process.env.EMAIL);
          done();
        });
    });

    it('should return 403 status for non admins', (done) => {
      request
        .get('/v1/users')
        .set('Accept', 'application/json')
        .set('X-Auth', token)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('The resource you are looking for does not exist');
          done();
        });
    });
  });

  // POST /v1/users route
  describe('POST /v1/users', () => {
    beforeEach((done) => {
      User.create({
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: hashPassword(process.env.PASSWORD),
        email: process.env.EMAIL,
        roleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('should not POST incomplete user data', (done) => {
      const user = {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        email: process.env.EMAIL,
      };

      request
        .post('/v1/users')
        .set('X-Auth', authToken)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(isEmpty(res.body.errors)).to.equal(false);
          expect(res.body.errors.username).to.equal('Username is required');
          expect(res.body.errors.firstname).to.equal('Firstname is required');
          expect(res.body.errors.lastname).to.equal('Lastname is required');
          expect(res.body.errors.password).to.equal('Password is required');
          expect(res.body.errors).to.not.have.property('email');
          done();
        });
    });

    it('should return 422 status message for duplicate user', (done) => {
      const user = {
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: hashPassword(process.env.PASSWORD),
        email: process.env.EMAIL,
        roleId: 1
      };

      request
        .post('/v1/users/')
        .set('X-Auth', authToken)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to
            .equal('username and email must be unique');
          done();
        });
    });

    it('should post a valid user data', (done) => {
      const user = {
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: hashPassword('test'),
        email: 'devjckennedy@gmail.com',
        roleId: 1
      };

      request
        .post('/v1/users')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('user');
          expect(res.body).to.have.property('token');
          expect(res.body.user.email).to.equal('devjckennedy@gmail.com');
          expect(res.body.user.username).to.equal('acedcoder');
          done();
        });
    });
  });

  // GET /v1/users/:id route
  describe('GET /v1/users/:id', () => {
    beforeEach((done) => {
      User.create({
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: hashPassword(process.env.PASSWORD),
        email: process.env.EMAIL,
        roleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('gets a user by id', (done) => {
      request
        .get('/v1/users/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.username).to.equal(process.env.USERNAME);
          expect(res.body.firstname).to.equal(process.env.FIRSTNAME);
          expect(res.body.lastname).to.equal(process.env.LASTNAME);
          expect(res.body.email).to.equal(process.env.EMAIL);
          done();
        });
    });

    it('returns a 404 status message for non-existing user', (done) => {
      request
        .get('/v1/users/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 400 status message for invalid param', (done) => {
      request
        .get('/v1/users/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .get('/v1/users/101243578787677678575645456674644646')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // GET /v1/users/:id/documents
  describe('GET /v1/users/:id/documents', () => {
    beforeEach((done) => {
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
        Document.create({
          title: 'GET User Doc',
          content: 'Running Tests',
          author: 'John Kennedy',
          userId: 1,
          roleId: 1,
          access: 'public'
        })
          .then(() => {
            done();
          });
      });
    });

    it('returns error on invalid document id', (done) => {
      request
        .get('/v1/users/cj/documents')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .get('/v1/users/10/documents')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 404 status if a document is not found for a user', (done) => {
      request
        .get('/v1/users/2/documents')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('No document found for this user');
          done();
        });
    });

    it('returns all documents belonging to the user', (done) => {
      request
        .get('/v1/users/1/documents')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body[0].title).to.equal('GET User Doc');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .get('/v1/users/101243578787677678575645456674644646/documents')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/users/:id route
  describe('PUT /v1/users/:id', () => {
    beforeEach((done) => {
      User.create({
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: hashPassword(process.env.PASSWORD),
        email: process.env.EMAIL,
        roleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('returns a 400 status for invalid input param', (done) => {
      request
        .put('/v1/users/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .put('/v1/users/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      User.create({
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: hashPassword('test'),
        email: 'devjckennedy@gmail.com',
        roleId: 2
      })
        .then(() => {
          //
        });

      request
        .put('/v1/users/1')
        .set('X-Auth', token)
        .send({
          email: 'devjckennedy@gmail.com',
          username: 'acedcoder'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to update this user");
          done();
        });
    });

    it('returns a 422 status for duplicate email or username', (done) => {
      User.bulkCreate([{
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: hashPassword('test'),
        email: 'devjckennedy@gmail.com',
        roleId: 1,
      }, {
        username: 'intelbrainee',
        firstname: 'Kennedy',
        lastname: 'John',
        password: hashPassword('test'),
        email: 'kennedy20000@yahoo.com',
        roleId: 2,
      }])
        .then(() => {
          request
            .put('/v1/users/1')
            .set('X-Auth', authToken)
            .send({
              email: 'kennedy20000@yahoo.com',
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body.message).to.equal('A user exist with same email or username');
              done();
            });
        });
    });

    it('updates a user by id', (done) => {
      request
        .put('/v1/users/1')
        .set('X-Auth', authToken)
        .send({
          lastname: 'Nwaorgu',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.username).to.equal(process.env.USERNAME);
          expect(res.body.firstname).to.equal(process.env.FIRSTNAME);
          expect(res.body.lastname).to.equal('Nwaorgu');
          expect(res.body.email).to.equal(process.env.EMAIL);
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .put('/v1/users/101243578787677678575645456674644646')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // DELETE /v1/users/:id route
  describe('DELETE /v1/users/:id', () => {
    beforeEach((done) => {
      User.create({
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: hashPassword(process.env.PASSWORD),
        email: process.env.EMAIL,
        roleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('returns a 400 status for invalid input param', (done) => {
      request
        .delete('/v1/users/cj')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .put('/v1/users/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      User.create({
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: hashPassword('test'),
        email: 'devjckennedy@gmail.com',
        roleId: 2
      })
        .then(() => {
          //
        });

      request
        .delete('/v1/users/1')
        .set('X-Auth', token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to delete this user");
          done();
        });
    });

    it('deletes a user by id', (done) => {
      request
        .delete('/v1/users/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('User deleted successfully');
          done();
        });
    });

    it('given a non-existing user id, it returns a 404 status', (done) => {
      request
        .delete('/v1/users/10')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .delete('/v1/users/101243578787677678575645456674644646')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });
});

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../../dist/server';
import models from '../../../server/models';

const { Document, Role, User } = models;
const request = supertest.agent(app);

const {
  AUTH_TOKEN,
  EMAIL,
  FIRSTNAME,
  LASTNAME,
  PASSWORD,
  TOKEN,
  USERNAME
} = process.env;

describe('Users endpoints', () => {
  before((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        Role.bulkCreate([
          { name: 'admin' },
          { name: 'user' }
        ]);

        User.create({
          username: USERNAME,
          firstname: FIRSTNAME,
          lastname: LASTNAME,
          password: PASSWORD,
          email: EMAIL,
          roleId: 1
        }).then(() => {
          // Creating this user is important for tests using the TOKEN constant to pass
          const newUser = {
            username: 'acedcoder',
            firstname: FIRSTNAME,
            lastname: LASTNAME,
            password: PASSWORD,
            email: 'devjckennedy@gmail.com',
          };

          request
            .post('/v1/auth/signup')
            .send(newUser)
            .then(() => {
              done();
            });
        });
      });
  });

  // GET /v1/users route
  describe('GET /v1/users', () => {
    it('validates offset and limit query params', (done) => {
      request
        .get('/v1/users/?limit=cj&offset=0')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Limit must be an integer');
          done();
        });
    });

    it('given valid offset and limit, it returns correct data', (done) => {
      request
        .get('/v1/users/?limit=1&offset=0')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.metaData.pageSize).to.equal(1);
          expect(res.body.metaData.totalCount).to.equal(1);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0].firstname).to.equal('Kennedy');
          expect(res.body.users[0].email).to.equal(EMAIL);
          done();
        });
    });

    it('should return a 401 status on header with no token set', (done) => {
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
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.users).to.be.an('array');
          expect(res.body.users[0].firstname).to.equal('Kennedy');
          expect(res.body.users[0].email).to.equal(EMAIL);
          done();
        });
    });

    it('should return 403 status for non admins', (done) => {
      request
        .get('/v1/users')
        .set('Accept', 'application/json')
        .set('Authorization', TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('The resource you are looking for does not exist');
          done();
        });
    });
  });

  // GET /v1/users/:id route
  describe('GET /v1/users/:id', () => {
    it('gets a user by id', (done) => {
      request
        .get('/v1/users/1')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.username).to.equal(USERNAME);
          expect(res.body.firstname).to.equal(FIRSTNAME);
          expect(res.body.lastname).to.equal(LASTNAME);
          expect(res.body.email).to.equal(EMAIL);
          done();
        });
    });

    it('returns a 404 status message for non-existing user', (done) => {
      request
        .get('/v1/users/10')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 400 status message for invalid param', (done) => {
      request
        .get('/v1/users/cj')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .get('/v1/users/101243578787677')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // GET /v1/users/:id/documents
  describe('GET /v1/users/:id/documents', () => {
    before((done) => {
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

    it('returns error on invalid document id', (done) => {
      request
        .get('/v1/users/cj/documents')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .get('/v1/users/10/documents')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 404 status if a document is not found for a user', (done) => {
      request
        .get('/v1/users/2/documents')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('No document found for this user');
          done();
        });
    });

    it('returns all documents belonging to the user', (done) => {
      request
        .get('/v1/users/1/documents')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents[0].title).to.equal('GET User Doc');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .get('/v1/users/101243578787677678/documents')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/users/:id route
  describe('PUT /v1/users/:id', () => {
    it('returns a 400 status for invalid input param', (done) => {
      request
        .put('/v1/users/cj')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .put('/v1/users/10')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      request
        .put('/v1/users/1')
        .set('Authorization', TOKEN)
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
      request
        .put('/v1/users/1')
        .set('Authorization', AUTH_TOKEN)
        .send({
          email: 'devjckennedy@gmail.com',
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A user exist with same email or username');
          done();
        });
    });

    it('updates a user by id', (done) => {
      request
        .put('/v1/users/1')
        .set('Authorization', AUTH_TOKEN)
        .send({
          lastname: 'Nwaorgu',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.username).to.equal(USERNAME);
          expect(res.body.firstname).to.equal(FIRSTNAME);
          expect(res.body.lastname).to.equal('Nwaorgu');
          expect(res.body.email).to.equal(EMAIL);
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .put('/v1/users/101243578787677678575')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // DELETE /v1/users/:id route
  describe('DELETE /v1/users/:id', () => {
    it('returns a 400 status for invalid input param', (done) => {
      request
        .delete('/v1/users/cj')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing user', (done) => {
      request
        .put('/v1/users/10')
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      request
        .delete('/v1/users/1')
        .set('Authorization', TOKEN)
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
        .set('Authorization', AUTH_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('User deleted successfully');
          done();
        });
    });

    it('given a non-existing user id, it returns a 404 status', (done) => {
      request
        .delete('/v1/users/10')
        .set('Authorization', TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .delete('/v1/users/101243578787677678575')
        .set('Authorization', TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });
});

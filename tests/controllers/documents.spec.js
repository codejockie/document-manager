import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
import models from '../../server/models';

const Document = models.Document;
const User = models.User;
const Role = models.Role;

const request = supertest.agent(app);

const authToken = process.env.AUTH_TOKEN;
const token = process.env.TOKEN;
const invalidToken = process.env.INVALID_TOKEN;
const nonUserToken = process.env.NON_USER_TOKEN;

describe('Documents endpoints', () => {
  beforeEach((done) => {
    Document.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
      .then(() => {
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
  });

  // GET /v1/documents route
  describe('GET /v1/documents', () => {
    beforeEach((done) => {
      User.create({
        username: process.env.USERNAME,
        firstname: process.env.FIRSTNAME,
        lastname: process.env.LASTNAME,
        password: process.env.PASSWORD,
        email: process.env.EMAIL,
        roleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('retrieves all documents', (done) => {
      Document.bulkCreate([{
        title: 'Data 1',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1
      }, {
        title: 'Data 2',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'Data 3',
        content: 'Tests Running!!!',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }]).then(() => {
        //
      });

      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents).to.be.an('array');
          expect(res.body.documents).to.have.lengthOf(3);
          done();
        });
    });

    it('validates offset and limit query params', (done) => {
      request
        .get('/v1/documents/?limit=cj&offset=0')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Limit and Offset params must be numbers');
          done();
        });
    });

    it('given valid offset and limit, it returns correct data', (done) => {
      Document.bulkCreate([{
        title: 'Data 1',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'Data 2',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'Data 3',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'Data 4',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }]).then(() => {
        //
      });

      request
        .get('/v1/documents/?limit=3&offset=3')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.metaData.pageSize).to.equal(1);
          expect(res.body.metaData.totalCount).to.equal(4);
          expect(res.body.documents).to.be.an('array');
          expect(res.body.documents[0].title).to.equal('Data 4');
          done();
        });
    });

    it('returns 404 status message if no document is found', (done) => {
      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('No document found');
          done();
        });
    });

    it('throws an error with an invalid token', (done) => {
      request
        .get('/v1/documents/1')
        .set('X-Auth', invalidToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Unauthorised user');
          done();
        });
    });

    it('given a non existing user, it throws an error', (done) => {
      request
        .get('/v1/documents')
        .set('X-Auth', nonUserToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Unauthorised user');
          done();
        });
    });
  });

  // POST /v1/documents route
  describe('POST /v1/documents', () => {
    beforeEach((done) => {
      const user = {
        username: process.env.USERNAME,
        firstname: 'Kennedy',
        lastname: 'John',
        password: process.env.PASSWORD,
        email: process.env.EMAIL,
        roleId: 1
      };

      User.create(user).then(() => {
        done();
      });
    });

    it('should return a 400 status message on incomplete data', (done) => {
      const document = {
        title: 'Incomplete data',
      };

      request
        .post('/v1/documents')
        .set('X-Auth', authToken)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.content).to.equal('Content is required');
          done();
        });
    });

    it('should post a valid document', (done) => {
      const document = {
        title: 'Complete data',
        content: 'Tests Running',
        author: 'John Kennedy',
        access: 'public'
      };

      request
        .post('/v1/documents')
        .set('X-Auth', authToken)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.title).to.equal('Complete data');
          expect(res.body.content).to.equal('Tests Running');
          done();
        });
    });

    it('should throw an error for duplicate title', (done) => {
      const document = {
        title: 'Complete data',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1
      };

      Document.create(document).then(() => {
        //
      });

      request
        .post('/v1/documents')
        .set('X-Auth', authToken)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A document exist with the same title');
          done();
        });
    });

    it('given an invalid access type, it should return a 400 status', (done) => {
      const document = {
        title: 'Complete data',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'invalid',
        userId: 1,
        roleId: 1
      };

      Document.create(document).then(() => {
        //
      })
        .catch(() => {
          request
            .post('/v1/documents')
            .set('X-Auth', authToken)
            .send(document)
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal("Access field must be any of 'public' or 'private'");
              done();
            });
        });
    });
  });

  // GET /v1/documents/:id route
  describe('GET /v1/documents/:id', () => {
    beforeEach((done) => {
      const user = {
        username: process.env.USERNAME,
        firstname: 'Kennedy',
        lastname: 'John',
        password: process.env.PASSWORD,
        email: process.env.EMAIL,
        roleId: 1
      };
      const user2 = {
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: 'test',
        email: 'devjckennedy@gmail.com',
        roleId: 2
      };

      User.bulkCreate([user, user2]).then(() => {
        done();
      });
    });

    it('should throw error for invalid id', (done) => {
      request
        .get('/v1/documents/sdfsfd')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Param must be a number');
          done();
        });
    });

    it('should return 404 status if document is not found', (done) => {
      request
        .get('/v1/documents/1/')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('Document not found');
          done();
        });
    });

    it('should throw error for unauthorised user', (done) => {
      Document.create({
        title: 'Testing',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      })
        .then(() => {
          //
        });

      request
        .get('/v1/documents/1/')
        .set('X-Auth', token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to access this document");
          done();
        });
    });

    it('should get a document a user has access to', (done) => {
      Document.create({
        title: 'Test GET document',
        content: 'Running Tests',
        author: 'John Kennedy',
        userId: 1,
        roleId: 1,
        access: 'public'
      })
        .then(() => {
          //
        });

      request
        .get('/v1/documents/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Test GET document');
          expect(res.body.content).to.equal('Running Tests');
          done();
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      request
        .get('/v1/documents/101243578787677678575645456674644646')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/documents/:id route
  describe('PUT /v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        username: process.env.USERNAME,
        firstname: 'Kennedy',
        lastname: 'John',
        password: process.env.PASSWORD,
        email: process.env.EMAIL,
        roleId: 1
      }, {
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: 'test',
        email: 'devjckennedy@gmail.com',
        roleId: 2
      }]).then(() => {
        done();
      });
    });

    it('return error on invalid document id', (done) => {
      const document = {
        title: 'Test PUT',
        content: 'Running Tests',
        author: 'John Kennedy',
        userId: 1,
        roleId: 1
      };

      request
        .put('/v1/documents/cj')
        .set('X-Auth', authToken)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status if document is not found', (done) => {
      request
        .put('/v1/documents/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      Document.create({
        title: 'PUT test',
        content: 'Running Tests',
        author: 'John Kennedy',
        userId: 1,
        roleId: 1,
        access: 'public'
      })
        .then(() => {
          //
        });

      request
        .put('/v1/documents/1')
        .set('X-Auth', token)
        .send({
          content: 'Whats up?'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to update this document");
          done();
        });
    });

    it('should update a document by id', (done) => {
      Document.create({
        title: 'PUT at work',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      })
        .then(() => {
          request
            .put('/v1/documents/1')
            .set('X-Auth', authToken)
            .send({
              title: 'Hello PUT',
              content: 'Tests Running',
            })
            .end((err, res) => {
              expect(res.status).to.equal(201);
              expect(res.body.document.content).to.equal('Tests Running');
              done();
            });
        });
    });

    it('returns a 400 status for duplicate title', (done) => {
      Document.bulkCreate([{
        title: 'PUTs',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'PUTs at work',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1,
      }])
        .then(() => {
          request
            .put('/v1/documents/1')
            .set('X-Auth', authToken)
            .send({
              title: 'PUTs at work',
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body.message).to.equal('A document exist with the same title');
              done();
            });
        });
    });

    it('should throw an error with an invalid access type', (done) => {
      const document = {
        title: 'Complete data',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'private',
        userId: 1,
        roleId: 1
      };

      Document.create(document).then(() => {
        request
          .put('/v1/documents/1')
          .set('X-Auth', authToken)
          .send({
            access: 'invalid',
          })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal("Access field must be any of 'public' or 'private'");
            done();
          });
      });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      const document = {
        title: 'Complete data',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'private',
        userId: 1,
        roleId: 1
      };

      Document.create(document).then(() => {
        request
          .put('/v1/documents/101243578787677678575645456674644646')
          .set('X-Auth', authToken)
          .send({
            access: 'public',
          })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid ID');
            done();
          });
      });
    });
  });

  // DELETE /v1/documents/:id route
  describe('DELETE /v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        username: process.env.USERNAME,
        firstname: 'Kennedy',
        lastname: 'John',
        password: process.env.PASSWORD,
        email: process.env.EMAIL,
        roleId: 1
      }, {
        username: 'acedcoder',
        firstname: 'Kennedy',
        lastname: 'John',
        password: 'test',
        email: 'devjckennedy@gmail.com',
        roleId: 2
      }]
      ).then(() => {
        done();
      });
    });

    it('returns error for invalid parameter', (done) => {
      request
        .delete('/v1/documents/cj/')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns 404 status for non existing document', (done) => {
      request
        .delete('/v1/documents/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      Document.create({
        title: 'Hey DELETE',
        content: 'Running Tests',
        author: 'John Kennedy',
        userId: 1,
        roleId: 1,
        access: 'public',
      })
        .then(() => {
          //
        });

      request
        .delete('/v1/documents/1')
        .set('X-Auth', token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to delete this document");
          done();
        });
    });

    it('delete a single document', (done) => {
      Document.create({
        title: 'Hey DELETE',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1
      })
        .then(() => {
          request
            .delete('/v1/documents/1/')
            .set('X-Auth', authToken)
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body.message).to
                .equal('Document deleted successfully');
              done();
            });
        });
    });

    it('given an invalid id, it returns a 400 status', (done) => {
      Document.create({
        title: 'Hey DELETE',
        content: 'Running Tests',
        author: 'John Kennedy',
        userId: 1,
        roleId: 1,
        access: 'public',
      })
        .then(() => {
          request
            .delete('/v1/documents/101243578787677678575645456674644646')
            .set('X-Auth', authToken)
            .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('Invalid ID');
              done();
            });
        });
    });
  });
});

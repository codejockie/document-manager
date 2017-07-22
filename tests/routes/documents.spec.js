import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../../build/server';

const Document = require('../../build/models/index').Document;
const User = require('../../build/models/index').User;
const Role = require('../../build/models/index').Role;

const request = supertest.agent(app);
chai.use(chaiHttp);

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrZW5uZWR5Lm53YW9yZ3VAYW5kZWxhLmNvbSIsInVzZXJuYW1lIjoiY29kZWpvY2tpZSIsImlhdCI6MTUwMDY2MTAwMywiZXhwIjoxNTAwOTIwMjAzfQ.8x36eu9hgEGkrWCYcH2ImA2z7N7OXtzOazVRM0GlaEA';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkZXZqY2tlbm5lZHlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhY2VkY29kZXIiLCJpYXQiOjE1MDA2MzI4OTYsImV4cCI6MTUwMDcxOTI5Nn0.Erx2eK5pyJ8Ct5HlRULOcRfoGSLGim-PrEmxk537Tmw';

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

    it('successfully connects to the API', (done) => {
      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
    });

    it('retrieves all documents', (done) => {
      Document.create({
        title: 'Test GET',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1
      })
        .then(() => {
          //
        });

      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.have.length.greaterThan(0);
          }
          done();
        });
    });

    it('validates offset and limit query params', (done) => {
      request
        .get('/v1/documents/?limit=cj&offset=0')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('Limit and Offset params must be numbers');
          }
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
      }]).then(() => {
        //
      });

      request
        .get('/v1/documents/?limit=2&offset=0')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('ok');
            expect(res.body.count).to.equal(2);
            expect(res.body.data).to.be.an('array');
            expect(res.body.data[0].title).to.equal('Data 1');
          }
          done();
        });
    });

    it('returns 404 status message if no document is found', (done) => {
      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('No document found');
          }
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.errors.content).to.equal('Content is required');
          }
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
          if (!err) {
            expect(res.status).to.equal(201);
          }
          done();
        });
    });

    it('should throw error for duplicate title', (done) => {
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('A document exist with the same title');
          }
          done();
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to
              .equal('Param must be a number');
          }
          done();
        });
    });

    it('should 404 status if document is not found', (done) => {
      request
        .get('/v1/documents/1/')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to
              .equal('Document not found');
          }
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
          if (!err) {
            expect(res.status).to.equal(401);
            expect(res.body.message).to
              .equal('Unauthorised user. You don\'t have permission to access this document');
          }
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
        .get('/v1/documents/1/')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
    });
  });

  // PUT /v1/documents/:id route
  describe('PUT /v1/users/:id', () => {
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Document id must be a number');
          }
          done();
        });
    });

    it('returns a 404 status if document is not found', (done) => {
      request
        .put('/v1/documents/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Document not found');
          }
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
          if (!err) {
            expect(res.status).to.equal(401);
            expect(res.body.message).to
              .equal('Unauthorised user. You don\'t have permission to update this document');
          }
          done();
        });
    });

    it('update a document by id', (done) => {
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
              if (!err) {
                expect(res.status).to.equal(201);
                expect(res.body.data.content).to.equal('Tests Running');
              }
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
              if (!err) {
                expect(res.status).to.equal(400);
                expect(res.body.message).to.equal('A document exist with the same title');
              }
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Document id must be a number');
          }
          done();
        });
    });

    it('returns 404 status for non existing document', (done) => {
      request
        .delete('/v1/documents/1')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Document not found');
          }
          done();
        });
    });

    it('should throw error for unauthorised user', (done) => {
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
          if (!err) {
            expect(res.status).to.equal(401);
            expect(res.body.message).to
              .equal('Unauthorised user. You don\'t have permission to delete this document');
          }
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
              if (!err) {
                expect(res.status).to.equal(200);
                expect(res.body.message).to
                  .equal('Document deleted successfully');
              }
              done();
            });
        });
    });
  });
});

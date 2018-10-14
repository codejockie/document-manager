import { expect } from 'chai';
import { agent } from 'supertest';
import app from '../../../dist/server';

const request = agent(app);
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const {
  ADMIN_TOKEN,
  INVALID_TOKEN,
  NON_ADMIN_TOKEN,
  NON_USER_TOKEN
} = process.env;
const ACCESS_ERROR = "Access field must be any of 'public' or 'private' or 'role'";

describe('Documents endpoints', () => {
  // GET /v1/documents route
  describe('GET /v1/documents', () => {
    it('given an admin, it retrieves all documents', (done) => {
      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents[0].title).to.equal('Lorem');
          expect(res.body.documents[1].title).to.equal('Lorem Ipsum');
          expect(res.body.documents).to.have.lengthOf(5);
          done();
        });
    });

    it('given a non admin, it retrieves based on access type', (done) => {
      request
        .get('/v1/documents')
        .set('Accept', 'application/json')
        .set('Authorization', NON_ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents[0].title).to.equal('Lorem Ipsum 3');
          expect(res.body.documents[1].title).to.equal('Lorem Ipsum 4');
          expect(res.body.documents).to.have.lengthOf(2);
          done();
        });
    });

    it('validates offset and limit query params', (done) => {
      request
        .get('/v1/documents/?limit=10&offset=cj')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Offset must be an integer');
          done();
        });
    });

    it('given valid offset and limit, it returns correct data', (done) => {
      request
        .get('/v1/documents/?limit=2&offset=0')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.metaData.pageSize).to.equal(2);
          expect(res.body.metaData.totalCount).to.equal(2);
          expect(res.body.documents[0].title).to.equal('Lorem');
          done();
        });
    });

    it('throws an error with an invalid token', (done) => {
      request
        .get('/v1/documents')
        .set('Authorization', INVALID_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    });

    it('given a non existing user, it throws an error', (done) => {
      request
        .get('/v1/documents')
        .set('Authorization', NON_USER_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    });
  });

  // POST /v1/documents route
  describe('POST /v1/documents', () => {
    it('should return a 400 status message on incomplete data', (done) => {
      const document = {
        title: 'Incomplete data',
      };

      request
        .post('/v1/documents')
        .set('Authorization', ADMIN_TOKEN)
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
        .set('Authorization', ADMIN_TOKEN)
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

      request
        .post('/v1/documents')
        .set('Authorization', ADMIN_TOKEN)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A document exist with the same title');
          done();
        });
    });

    it('given an invalid access type, it should return a 500 status', (done) => {
      const document = {
        title: 'New data',
        content: 'Running Tests',
        author: 'John Kennedy',
        access: 'invalid',
        userId: 1,
        roleId: 1
      };

      request
        .post('/v1/documents')
        .set('Authorization', ADMIN_TOKEN)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal(ACCESS_ERROR);
          done();
        });
    });
  });

  // GET /v1/documents/:id route
  describe('GET /v1/documents/:id', () => {
    it('should throw error for invalid id', (done) => {
      request
        .get('/v1/documents/sdfsfd')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to
            .equal('Param must be a number');
          done();
        });
    });

    it('should return 404 status if document is not found', (done) => {
      request
        .get('/v1/documents/10/')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('Document not found');
          done();
        });
    });

    it('should throw error for unauthorised user', (done) => {
      request
        .get('/v1/documents/1/')
        .set('Authorization', NON_ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to access this document");
          done();
        });
    });

    it('should get a document a user has access to', (done) => {
      request
        .get('/v1/documents/1')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Lorem');
          expect(res.body.content).to.equal(TEXT);
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .get('/v1/documents/10124357878767767')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/documents/:id route
  describe('PUT /v1/documents/:id', () => {
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
        .set('Authorization', ADMIN_TOKEN)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status if document is not found', (done) => {
      request
        .put('/v1/documents/20')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      request
        .put('/v1/documents/1')
        .set('Authorization', NON_ADMIN_TOKEN)
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
      request
        .put('/v1/documents/1')
        .set('Authorization', ADMIN_TOKEN)
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

    it('returns a 422 status for duplicate title', (done) => {
      request
        .put('/v1/documents/1')
        .set('Authorization', ADMIN_TOKEN)
        .send({ title: 'Lorem Ipsum 2' })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A document exist with the same title');
          done();
        });
    });

    it('should throw an error with an invalid access type', (done) => {
      request
        .put('/v1/documents/1')
        .set('Authorization', ADMIN_TOKEN)
        .send({
          access: 'invalid',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal(ACCESS_ERROR);
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .put('/v1/documents/10124357878767767857')
        .set('Authorization', ADMIN_TOKEN)
        .send({
          access: 'public',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // DELETE /v1/documents/:id route
  describe('DELETE /v1/documents/:id', () => {
    it('returns error for invalid parameter', (done) => {
      request
        .delete('/v1/documents/cj/')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns 404 status for non existing document', (done) => {
      request
        .delete('/v1/documents/10')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('returns a 401 status for unauthorised user', (done) => {
      request
        .delete('/v1/documents/1')
        .set('Authorization', NON_ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to
            .equal("Unauthorised user. You don't have permission to delete this document");
          done();
        });
    });

    it('delete a single document', (done) => {
      request
        .delete('/v1/documents/3/')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to
            .equal('Document deleted successfully');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .delete('/v1/documents/1012435787876776785')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });
});

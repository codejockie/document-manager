import { expect } from 'chai';
import { agent } from 'supertest';
import app from '../../../dist/server';

const request = agent(app);
const { ADMIN_TOKEN } = process.env;
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

describe('Search endpoints', () => {
  // GET /v1/search/users
  describe('GET /v1/search/users', () => {
    it('returns a 400 status if query param is not supplied', (done) => {
      request
        .get('/v1/search/users?q=')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Query param is required');
          done();
        });
    });

    it('returns an empty array if user is not found', (done) => {
      request
        .get('/v1/search/users?q=adeleke')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.user).to.eqls([]);
          done();
        });
    });

    it('returns an array of users if found', (done) => {
      request
        .get('/v1/search/users?q=code')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.users).to.have.lengthOf(1);
          expect(res.body.users[0].username).to.equal(process.env.ADMIN_USERNAME);
          done();
        });
    });
  });

  // GET /v1/search/documents
  describe('GET /v1/search/documents', () => {
    it('returns a 400 status if query param is not supplied', (done) => {
      request
        .get('/v1/search/documents?q=')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Query param is required');
          done();
        });
    });

    it('returns an empty array if document is not found', (done) => {
      request
        .get('/v1/search/documents/?q=oldsanden')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.document).to.eqls([]);
          done();
        });
    });

    it('returns an array of documents if found', (done) => {
      request
        .get('/v1/search/documents/?q=Lorem')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents).to.have.lengthOf(3);
          expect(res.body.documents[0].title).to.equal('Lorem Ipsum');
          expect(res.body.documents[1].content).to.equal(TEXT);
          done();
        });
    });
  });
});

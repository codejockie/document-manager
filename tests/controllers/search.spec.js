import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../src/server';
import models from '../../server/models';

const Document = models.Document;
const User = models.User;
const Role = models.Role;

const request = supertest.agent(app);

const authToken = process.env.AUTH_TOKEN;

describe('Search endpoints', () => {
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

  // GET /v1/search/users
  describe('GET /v1/search/users', () => {
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

    it('returns a 400 status if query param is not supplied', (done) => {
      request
        .get('/v1/search/users?q=')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Query param is required');
          done();
        });
    });

    it('returns an empty array if user is not found', (done) => {
      request
        .get('/v1/search/users?q=adeleke')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.user).to.eqls([]);
          done();
        });
    });

    it('returns an array of users if found', (done) => {
      request
        .get('/v1/search/users?q=code')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.users).to.have.lengthOf(1);
          expect(res.body.users[0].username).to.equal(process.env.USERNAME);
          done();
        });
    });
  });

  // GET /v1/search/documents
  describe('GET /v1/search/documents', () => {
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

    it('returns a 400 status if query param is not supplied', (done) => {
      request
        .get('/v1/search/documents?q=')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Query param is required');
          done();
        });
    });

    it('returns an empty array if document is not found', (done) => {
      request
        .get('/v1/search/documents/?q=oldsanden')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.document).to.eqls([]);
          done();
        });
    });

    it('returns an array of documents if found', (done) => {
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
        access: 'private',
        userId: 1,
        roleId: 1,
      }]).then(() => {
        //
      });

      request
        .get('/v1/search/documents/?q=data')
        .set('X-Auth', authToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents).to.have.lengthOf(2);
          expect(res.body.documents[0].title).to.equal('Data 1');
          expect(res.body.documents[1].content).to.equal('Tests Running');
          done();
        });
    });
  });
});

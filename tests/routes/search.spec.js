import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../../build/server';

const User = require('../../build/models').User;
const Role = require('../../build/models').Role;
const Document = require('../../build/models').Document;

const request = supertest.agent(app);
chai.use(chaiHttp);

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrZW5uZWR5Lm53YW9yZ3VAYW5kZWxhLmNvbSIsInVzZXJuYW1lIjoiY29kZWpvY2tpZSIsImlhdCI6MTUwMDYzMjcyMSwiZXhwIjoxNTAwNzE5MTIxfQ.A4A7NGBZggJjVjzcenB9RQ_pNfzqyYTssTmQtnfcQJ4';

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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Query param is required');
          }
          done();
        });
    });

    it('returns an empty array if user is not found', (done) => {
      request
        .get('/v1/search/users?q=adeleke')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.eqls([]);
          }
          done();
        });
    });

    it('returns an array of users if found', (done) => {
      request
        .get('/v1/search/users?q=codejockie')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.be.greaterThan(0);
          }
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Query param is required');
          }
          done();
        });
    });

    it('returns an empty array if document is not found', (done) => {
      request
        .get('/v1/search/documents/?q=oldsanden')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.eqls([]);
          }
          done();
        });
    });

    it('returns an array of documents if found', (done) => {
      Document.create({
        title: 'Search docs',
        content: 'Search documents routes test',
        author: 'John Kennedy',
        access: 'public',
        userId: 1,
        roleId: 1
      }).then(() => {
        //
      });

      request
        .get('/v1/search/documents/?q=Search')
        .set('X-Auth', authToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.be.greaterThan(0);
          }
          done();
        });
    });
  });
});

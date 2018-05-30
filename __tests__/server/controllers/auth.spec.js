import { expect } from 'chai';
import supertest from 'supertest';
import isEmpty from 'lodash/isEmpty';
import app from '../../../dist/server';
import models from '../../../server/models';

const { Role } = models;
const request = supertest.agent(app);

const {
  EMAIL,
  FIRSTNAME,
  INVALID_TOKEN,
  LASTNAME,
  PASSWORD,
  TOKEN,
  USERNAME
} = process.env;

describe('Auth endpoints', () => {
  let user;
  before((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        Role.bulkCreate([
          { name: 'admin' },
          { name: 'user' }
        ]);
        done();
      });

    user = {
      username: USERNAME,
      firstname: FIRSTNAME,
      lastname: LASTNAME,
      password: PASSWORD,
      email: EMAIL,
      roleId: 1
    };
  });

  // POST /v1/auth/signup route
  describe('POST /v1/auth/signup', () => {
    it('should not POST incomplete user data', (done) => {
      const newUser = {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        email: EMAIL,
      };

      request
        .post('/v1/auth/signup')
        .send(newUser)
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

    it('should post a valid user data', (done) => {
      request
        .post('/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('user');
          expect(res.body).to.have.property('token');
          expect(res.body.user.email).to.equal(EMAIL);
          expect(res.body.user.username).to.equal(USERNAME);
          done();
        });
    });

    it('should return 422 status message for duplicate user', (done) => {
      request
        .post('/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to
            .equal('Username and Email must be unique');
          done();
        });
    });
  });

  // POST /v1/auth/signin
  describe('POST /v1/auth/signin', () => {
    it('should validate signin details', (done) => {
      request
        .post('/v1/auth/signin')
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

    it('given non-existing account details, it returns a 401 status', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: 'codejockie@codes.com',
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Username or Password incorrect');
          done();
        });
    });

    it('successfully authenticates a user', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: EMAIL,
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('generates a token on successful authentication', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: EMAIL,
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('sets the token on the header with a key of  X-Auth', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: EMAIL,
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.header['x-auth']).to.equal(res.body.token);
          done();
        });
    });

    it('given a wrong password, it throws an error', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: EMAIL,
          password: 'test'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Username or Password incorrect');
          done();
        });
    });
  });

  // POST v1/auth/verify route
  describe('POST /v1/auth/verify', () => {
    it('should return an error if no token is supplied', (done) => {
      request
        .post('/v1/auth/verify')
        .send({
          token: ''
        })
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.ok).to.equal(false);
          done();
        });
    });

    it('given an invalid token, it should validate it', (done) => {
      request
        .post('/v1/auth/verify')
        .send({
          token: INVALID_TOKEN
        })
        .then((res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.equal('Invalid token signature');
          expect(res.body.ok).to.equal(false);
          done();
        });
    });

    it('given a valid token, it should validate it', (done) => {
      request
        .post('/v1/auth/verify')
        .send({
          token: TOKEN
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.error).to.equal('');
          expect(res.body.ok).to.equal(true);
          done();
        });
    });
  });
});

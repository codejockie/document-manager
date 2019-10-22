import { expect } from 'chai';
import { agent } from 'supertest';
import isEmpty from 'lodash/isEmpty';
import app from '../../../dist/server';

const request = agent(app);

const {
  FIRSTNAME,
  INVALID_TOKEN,
  LASTNAME,
  NEW_USER_EMAIL,
  NEW_USER_USERNAME,
  NON_ADMIN_EMAIL,
  NON_ADMIN_TOKEN,
  PASSWORD
} = process.env;

describe('Auth endpoints', () => {
  const user = {
    username: NEW_USER_USERNAME,
    firstname: FIRSTNAME,
    lastname: LASTNAME,
    password: PASSWORD,
    email: NEW_USER_EMAIL
  };

  // POST /v1/auth/signup route
  describe('POST /v1/auth/signup', () => {
    it('should not POST incomplete user data', (done) => {
      const newUser = {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        email: NON_ADMIN_EMAIL,
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

    it('should post a valid user data', async () => {
      await request
        .post('/v1/auth/signup')
        .send(user)
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('user');
          expect(res.body).to.have.property('token');
          expect(res.body.user.email).to.equal(NEW_USER_EMAIL);
          expect(res.body.user.username).to.equal(NEW_USER_USERNAME);
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

    it('given non-existing account details, it returns a 500 status', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: 'codejockie@codes.com',
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).contains('Username or Password incorrect');
          done();
        });
    });

    it('successfully authenticates a user', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: NON_ADMIN_EMAIL,
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
          email: NON_ADMIN_EMAIL,
          password: PASSWORD
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('given a wrong password, it throws an error', (done) => {
      request
        .post('/v1/auth/signin')
        .send({
          email: NON_ADMIN_EMAIL,
          password: 'test'
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).contains('Username or Password incorrect');
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
          token: NON_ADMIN_TOKEN
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

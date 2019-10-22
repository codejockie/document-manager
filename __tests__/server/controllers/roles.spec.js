import { expect } from 'chai';
import { agent } from 'supertest';
import app from '../../../dist/server';

const request = agent(app);
const {
  ADMIN_TOKEN,
  NON_ADMIN_TOKEN
} = process.env;
const ADMIN_ROLE = 'Admin';
const USER_ROLE = 'User';
const PUBLISHER_ROLE = 'Publisher';
const TESTER_ROLE = 'Tester';

describe('Roles endpoints', () => {
  // POST /v1/roles route
  describe('POST /v1/roles', () => {
    it('should validate request', (done) => {
      const role = {
        name: '',
      };

      request
        .post('/v1/roles')
        .set('Authorization', ADMIN_TOKEN)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.name).to.equal('Name cannot be empty');
          done();
        });
    });

    it('should validate non alpha name', (done) => {
      const role = {
        name: 1,
      };

      request
        .post('/v1/roles')
        .set('Authorization', ADMIN_TOKEN)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.name).to.equal('Name can only contain letters');
          done();
        });
    });

    it('should check role uniqueness', (done) => {
      const role = {
        name: ADMIN_ROLE,
      };

      request
        .post('/v1/roles')
        .set('Authorization', ADMIN_TOKEN)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Role name must be unique');
          done();
        });
    });

    it('should create a new role', (done) => {
      const role = {
        name: PUBLISHER_ROLE
      };

      request
        .post('/v1/roles')
        .set('Authorization', ADMIN_TOKEN)
        .send(role)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(PUBLISHER_ROLE);
          done();
        });
    });
  });

  // GET /v1/roles route
  describe('GET /v1/roles', () => {
    it('successfully retrieves roles', (done) => {
      request
        .get('/v1/roles')
        .set('Accept', 'application/json')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.roles).to.be.an('array');
          expect(res.body.roles[0].name).to.equal(ADMIN_ROLE);
          expect(res.body.roles[1].name).to.equal(USER_ROLE);
          done();
        });
    });

    it('should return 403 status for non admins', (done) => {
      request
        .get('/v1/roles')
        .set('Authorization', NON_ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('The resource you are looking for does not exist');
          done();
        });
    });
  });

  // GET /v1/roles/:id route
  describe('GET /v1/roles/:id', () => {
    it('retrieves a role by id', (done) => {
      request
        .get('/v1/roles/1')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.name).to.equal(ADMIN_ROLE);
          done();
        });
    });

    it('returns a 404 status message for non-existing role', (done) => {
      request
        .get('/v1/roles/20')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('returns a 400 status message for invalid param', (done) => {
      request
        .get('/v1/roles/cj')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .get('/v1/roles/10124357878767767857')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // PUT /v1/roles/:id route
  describe('PUT /v1/roles/:id', () => {
    it('returns a 400 status for invalid input param', (done) => {
      request
        .put('/v1/roles/cj')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing role', (done) => {
      request
        .put('/v1/roles/10')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('returns a 422 status for duplicate role', (done) => {
      request
        .put('/v1/roles/1')
        .set('Authorization', ADMIN_TOKEN)
        .send({
          name: USER_ROLE,
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('A role exist with same name');
          done();
        });
    });

    it('updates a role by id', (done) => {
      request
        .put('/v1/roles/3')
        .set('Authorization', ADMIN_TOKEN)
        .send({
          name: TESTER_ROLE,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(TESTER_ROLE);
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .put('/v1/roles/6900795794579575')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });

  // DELETE /v1/roles/:id route
  describe('DELETE /v1/roles/:id', () => {
    it('returns a 400 status for invalid input param', (done) => {
      request
        .delete('/v1/roles/cj')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Param must be a number');
          done();
        });
    });

    it('returns a 404 status for non-existing role', (done) => {
      request
        .put('/v1/roles/10')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('deletes a role by id', (done) => {
      request
        .delete('/v1/roles/3')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Role deleted successfully');
          done();
        });
    });

    it('given a non-existing role id, it returns a 404 status', (done) => {
      request
        .delete('/v1/roles/10')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });

    it('given an invalid id, it returns a 500 status', (done) => {
      request
        .delete('/v1/roles/101243578787677678575')
        .set('Authorization', ADMIN_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Invalid ID');
          done();
        });
    });
  });
});

import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';

import models from '../models';
import {
  findByEmailAndPassword
} from '../helpers/jwt';

const JwtStrategy = Strategy;
const { User } = models;
const jwtOptions = {
  // Extract JWT from the request header called authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  findByEmailAndPassword(email, password)
    .then(user => done(null, user))
    .catch(() => done('Username or Password incorrect', false));
});

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findOne({
    where: {
      $or: [{
        id: payload.id
      }, {
        email: payload.email
      }]
    }
  })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(error => done(error, false));
});

passport.use(jwtLogin);
passport.use(localLogin);

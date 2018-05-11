import crypto from 'crypto';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';

import models from '../models';
import { serverErrorMessage } from '../helpers/messages';
import {
  emailOptions,
  generateUserObject,
  hashPassword,
  sendMail
} from '../helpers/helper';
import {
  findByEmailAndPassword,
  generateAuthToken
} from '../helpers/jwt';

const { User } = models;

// Configure email and password
const authEmail = process.env.MAILER_EMAIL_ID;

// Setup SMTP transport service
const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    type: 'OAuth2',
    user: authEmail,
    clientId: process.env.MAILER_CLIENT_ID,
    clientSecret: process.env.MAILER_CLIENT_SECRET,
    refreshToken: process.env.MAILER_REFRESH_TOKEN,
    accessToken: process.env.MAILER_ACCESS_TOKEN,
    expires: 3600
  }
});

// Configure handlebars
const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve(__dirname, '../templates'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

/**
  * AuthController class
  */
export default class AuthController {
  /**
   * Logs a user in
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } user
   */
  static signin(request, response) {
    const { email, password } = request.body;

    findByEmailAndPassword(email, password)
      .then((user) => {
        const token = generateAuthToken(user.id, user.email, user.username);
        response.header('X-Auth', token).send({
          user: generateUserObject(user),
          token
        });
      })
      .catch(() => response.status(401).send({
        message: 'Username or Password incorrect'
      }));
  }

  /**
   * Creates a new user
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } user
   */
  static signup(request, response) {
    const {
      email, firstname, lastname, password, username
    } = request.body;

    User.findOne({
      where: {
        $or: [
          { username },
          { email }
        ]
      }
    }).then((user) => {
      if (user) {
        return response.status(422).send({
          message: 'username and email must be unique'
        });
      }

      User.create({
        email,
        username,
        firstname,
        lastname,
        password,
        roleId: 2
      })
        .then((newUser) => {
          const token = generateAuthToken(newUser.id, newUser.email, newUser.username);
          response.header('X-Auth', token).status(201).send({
            user: generateUserObject(newUser),
            token
          });
        })
        .catch(() => response.status(500).send({
          message: serverErrorMessage
        }));
    });
  }

  /**
   * Handle forgot password
   * @param { Object } request
   * @param { Object } response
   * @returns { string } email status
   */
  static forgotPassword(request, response) {
    const { body: { email }, headers, hostname } = request;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return response.status(401).send({
            message: 'User not found'
          });
        }

        // Generates reset password token using crypto buffer to hex
        const resetPasswordToken = crypto.randomBytes(10).toString('hex');
        const resetPasswordExpires = new Date();
        resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 24);

        // Set password reset url
        let url = 'http';
        if (process.env.NODE_ENV === 'development') {
          url += `://${hostname}:${process.env.PORT}/auth/reset-password?password-reset-token=${resetPasswordToken}`;
        } else {
          url += `s://${hostname}/auth/reset-password?password-reset-token=${resetPasswordToken}`;
        }

        user.update({
          resetPasswordToken,
          resetPasswordExpires
        })
          .then(() => {
            const context = {
              browserName: headers['user-agent'],
              name: user.firstname,
              url,
            };
            const mailOptions = emailOptions(context, 'Password Reset', 'forgot-password', user.email);

            sendMail(smtpTransport, mailOptions, response);
          })
          .catch(error => response.status(500).send({ error }));
      })
      .catch(error => response.status(500).send({ error }));
  }

  /**
   * Handle password reset
   * @param { Object } request
   * @param { Object } response
   * @returns { string } reset status
   */
  static resetPassword(request, response) {
    User.findOne({
      where: {
        resetPasswordToken: request.body.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }
    }).then((user) => {
      if (!user) {
        return response.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }

      const { body: { password, verifyPassword } } = request;

      if (password !== verifyPassword) {
        return response.status(422).send({
          message: 'Passwords do not match'
        });
      }

      user.update({
        password: hashPassword(password, true),
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
        .then(() => {
          const context = {
            name: user.firstname
          };
          const mailOptions = emailOptions(context, 'Password Reset Confirmation', 'reset-password', user.email);

          sendMail(smtpTransport, mailOptions, response);
        })
        .catch(error => response.status(500).send({ error }));
    })
      .catch(error => response.status(500).send({ error }));
  }

  /**
   * Verify Auth Token
   * @param { Object } request
   * @param { Object } response
   * @returns { void }
   */
  static verify(request, response) {
    const { token } = request.body;

    if (!token) {
      response.status(400).send({
        error: 'Token not supplied'
      });
    }

    // TODO: Complete token verification
  }
}

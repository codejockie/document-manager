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
  generateAuthToken,
  verifyToken
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
    const { user } = request;
    const { email, id } = user;
    const token = generateAuthToken(id, email),
      userData = generateUserObject(user);

    response.send({ token, user: userData });
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
          message: 'Username and Email must be unique'
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
          response.status(201).send({
            token,
            user: generateUserObject(newUser)
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

        const isDev = process.env.NODE_ENV === 'development';
        const resetPasswordExpires = new Date();
        resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 24);
        // Generate reset password token
        const resetPasswordToken = crypto.randomBytes(15).toString('hex');
        // Set expiry to 24 hours from now
        const host = isDev ? `${hostname}:${process.env.PORT}` : `https://${hostname}`;
        // Set password reset url
        const url = `${host}/reset-password/${resetPasswordToken}`;

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
   * Verify auth token
   * @param { Object } request
   * @param { Object } response
   * @returns { void }
   */
  static verify(request, response) {
    const { body: { token } } = request;

    if (!token) {
      return response.status(400).send({
        error: 'Token not supplied',
        ok: false
      });
    }

    const tokenStatus = verifyToken(token);

    if (!tokenStatus.ok) {
      return response.status(401).send(tokenStatus);
    }

    response.status(200).send(tokenStatus);
  }
}

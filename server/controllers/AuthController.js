import path from 'path';
import crypto from 'crypto';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';

import models from '../models';
import { serverErrorMessage } from '../helpers/messages';
import {
  generateUserObject,
  getOperatingSystemType,
  hashPassword,
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
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  static signin(req, res) {
    const { email, password } = req.body;

    findByEmailAndPassword(email, password)
      .then((user) => {
        const token = generateAuthToken(user.id, user.email, user.username);
        res.header('X-Auth', token).send({
          user: generateUserObject(user),
          token
        });
      })
      .catch(() => res.status(401).send({
        message: 'Username or Password incorrect'
      }));
  }

  /**
   * Logs out a user
   * @param { Object } req
   * @param { Object } res
   * @returns { void }
   */
  static logout(req, res) {
    req.user = null;
    req.token = null;
    res.header('X-Auth', '').status(200).send({ message: 'Logged out' });
  }

  /**
   * Creates a new user
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } user
   */
  static signup(req, res) {
    const {
      email,
      firstname,
      lastname,
      password,
      username
    } = req.body;

    User.findOne({
      where: {
        $or: [
          { username },
          { email }
        ]
      }
    }).then((user) => {
      if (user) {
        return res.status(422).send({
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
          res.header('X-Auth', token).status(201).send({
            user: generateUserObject(newUser),
            token
          });
        })
        .catch(() => res.status(500).send({
          message: serverErrorMessage
        }));
    });
  }

  /**
   * Handle forgot password
   * @param { Object } req
   * @param { Object } res
   * @returns { string } email status
   */
  static forgotPassword(req, res) {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'User not found'
          });
        }

        // Generates reset password token using crypto buffer to hex
        const token = crypto.randomBytes(25).toString('hex');
        const date = new Date();
        date.setHours(date.getHours() + 24);

        // Set password reset url
        let url;
        if (process.env.NODE_ENV === 'development') {
          url = `https://${req.hostname}:${process.env.PORT}/auth/reset-password?token=${token}`;
        } else {
          url = `https://${req.hostname}/auth/reset-password?token=${token}`;
        }

        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: date
        })
          .then(() => {
            const mailOptions = {
              from: 'CJDocs <no-reply@cjdocs.com>',
              to: user.email,
              template: 'forgot-password',
              subject: 'Password Reset',
              context: {
                browserName: req.headers['user-agent'],
                name: user.firstname,
                operatingSystem: getOperatingSystemType(),
                url,
              }
            };

            smtpTransport.sendMail(mailOptions, (error, info) => {
              if (error) {
                return res.send({ message: 'Email not sent' });
              }
              return res.send({
                message: `Message sent. ${info.messageId}`
              });
            });
          })
          .catch(error => res.status(500).send({ error }));
      })
      .catch(error => res.status(500).send({ error }));
  }

  /**
   * Handle password reset
   * @param { Object } req
   * @param { Object } res
   * @returns { string } reset status
   */
  static resetPassword(req, res) {
    User.findOne({
      where: {
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }
    }).then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      }

      const { password, verifyPassword } = req.body;

      if (password !== verifyPassword) {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }

      user.update({
        password: hashPassword(password, true),
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
        .then(() => {
          const mailOptions = {
            from: 'CJDocs <no-reply@cjdocs.com>',
            to: user.email,
            template: 'reset-password',
            subject: 'Password Reset Confirmation',
            context: {
              name: user.firstname
            }
          };

          smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.send({ message: 'Email not sent' });
            }
            return res.send({
              message: `Message sent. ${info.messageId}`
            });
          });
        })
        .catch(error => res.status(500).send({ error }));
    })
      .catch(error => res.status(500).send({ error }));
  }
}

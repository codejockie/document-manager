import AuthController from '../controllers/AuthController';
import {
  validateLogin,
  validateUser
} from '../middleware/middleware';

const {
  forgotPassword,
  verify,
  resetPassword,
  signup,
  signin,
} = AuthController;

const auth = (router) => {
  router.route('/signin')
    .post(validateLogin, signin);

  router.route('/signup')
    .post(validateUser, signup);

  router.route('/forgot-password')
    .post(forgotPassword);

  router.route('/reset-password')
    .post(resetPassword);

  router.route('/verify')
    .post(verify);
};

export default auth;

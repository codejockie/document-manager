import AuthController from '../controllers/AuthController';
import {
  validateLogin,
  validateUser
} from '../middleware/middleware';

const {
  forgotPassword,
  logout,
  resetPassword,
  signup,
  signin,
} = AuthController;

const auth = (router) => {
  router.route('/signin')
    .post(validateLogin, signin);

  router.route('/logout')
    .post(logout);

  router.route('/signup')
    .post(validateUser, signup);

  router.route('/forgot-password')
    .post(forgotPassword);

  router.route('/reset-password')
    .post(resetPassword);
};

export default auth;

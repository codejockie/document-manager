import userController from '../controllers/userController';
import {
  validateLogin,
  validateUser
} from '../middleware/middleware';

const {
  signup,
  signin,
  logout
} = userController;

const auth = (router) => {
  router.route('/signin')
    .post(validateLogin, signin);

  router.route('/logout')
    .post(logout);

  router.route('/signup')
    .post(validateUser, signup);
};

export default auth;

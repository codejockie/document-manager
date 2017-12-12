import userController from '../controllers/userController';
import {
  validateLogin,
  validateUser
} from '../middleware/middleware';

const {
  createUser,
  login,
  logout
} = userController;

const authRoutes = (router) => {
  router.route('/login')
    .post(validateLogin, login);

  router.route('/logout')
    .post(logout);

  router.route('/register')
    .post(validateUser, createUser);
};

export default authRoutes;

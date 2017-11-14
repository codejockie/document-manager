import userController from '../controllers/userController';
import {
  validateLogin,
  validateUser
} from '../middleware/middleware';

const authRoutes = (router) => {
  router.route('/login')
    .post(validateLogin, userController.login);

  router.route('/logout')
    .post(userController.logout);

  router.route('/register')
    .post(validateUser, userController.create);
};

export default authRoutes;

import usersController from '../controllers/users';
import {
  authenticate,
  isAdministrator,
  validateLogin,
  validateParam,
  validateUser
} from '../middleware/middleware';

const userRoutes = (router) => {
  router.route('/users/login')
    .post(validateLogin, usersController.login);

  router.route('/users/logout')
    .post(usersController.logout);

  router.route('/users')
    .post(validateUser, usersController.signup)
    .get(authenticate, isAdministrator, usersController.getAll);

  router.route('/users/:id')
    .get(validateParam, authenticate, usersController.getOne)
    .put(validateParam, authenticate, usersController.update)
    .delete(validateParam, authenticate, usersController.delete);

  router.route('/users/:id/documents')
    .get(validateParam, usersController.getUserDocuments);
};

export default userRoutes;

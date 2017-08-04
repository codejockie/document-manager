import usersController from '../controllers/users';
import {
  authenticate,
  findUserById,
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
    .get(authenticate, validateParam, findUserById, usersController.getOne)
    .put(authenticate, validateParam, findUserById, usersController.update)
    .delete(authenticate, validateParam, findUserById, usersController.delete);

  router.route('/users/:id/documents')
    .get(validateParam, findUserById, usersController.getUserDocuments);
};

export default userRoutes;

import documentController from '../controllers/documents';
import rolesController from '../controllers/roles';
import searchController from '../controllers/search';
import usersController from '../controllers/users';
import {
  authenticate,
  findDocumentById,
  findRoleById,
  findUserById,
  isAdministrator,
  validateDocument,
  validateLimitAndOffset,
  validateLogin,
  validateParam,
  validateQuery,
  validateRole,
  validateUser
} from '../middleware/middleware';

const routes = (router) => {
  // Document routes
  router.route('/documents')
    .get(authenticate, validateLimitAndOffset, documentController.getAll)
    .post(authenticate, validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(authenticate, validateParam, findDocumentById, documentController.getOne)
    .put(authenticate, validateParam, findDocumentById, documentController.update)
    .delete(authenticate, validateParam, findDocumentById, documentController.delete);

  // Role routes
  router.route('/roles')
    .get(authenticate, isAdministrator, rolesController.getAll)
    .post(authenticate, isAdministrator, validateRole, rolesController.create);

  router.route('/roles/:id')
    .get(authenticate, isAdministrator, validateParam, findRoleById, rolesController.getOne)
    .put(authenticate, isAdministrator, validateParam, findRoleById, rolesController.update)
    .delete(authenticate, isAdministrator, validateParam, findRoleById, rolesController.delete);

  // Search route
  router.route('/search/users')
    .get(validateQuery, searchController.searchUser);

  router.route('/search/documents')
    .get(validateQuery, searchController.searchDocument);

  // User routes
  router.route('/users/login')
    .post(validateLogin, usersController.login);

  router.route('/users/logout')
    .post(usersController.logout);

  router.route('/users')
    .get(authenticate, isAdministrator, validateLimitAndOffset, usersController.getAll)
    .post(validateUser, usersController.signup);

  router.route('/users/:id')
    .get(authenticate, validateParam, findUserById, usersController.getOne)
    .put(authenticate, validateParam, findUserById, usersController.update)
    .delete(authenticate, validateParam, findUserById, usersController.delete);

  router.route('/users/:id/documents')
    .get(authenticate, validateParam, findUserById, usersController.getUserDocuments);
};

export default routes;

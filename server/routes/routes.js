import documentController from '../controllers/documentController';
import roleController from '../controllers/roleController';
import searchController from '../controllers/searchController';
import userController from '../controllers/userController';
import {
  isAdministrator,
  findDocumentById,
  findRoleById,
  findUserById,
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
    .get(validateLimitAndOffset, documentController.getAll)
    .post(validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(validateParam, findDocumentById, documentController.getOne)
    .put(validateParam, findDocumentById, documentController.update)
    .delete(validateParam, findDocumentById, documentController.delete);

  // Role routes
  router.route('/roles')
    .get(isAdministrator, roleController.getAll)
    .post(isAdministrator, validateRole, roleController.create);

  router.route('/roles/:id')
    .get(isAdministrator,
      validateParam, findRoleById, roleController.getOne)
    .put(isAdministrator,
      validateParam, findRoleById, roleController.update)
    .delete(isAdministrator,
      validateParam, findRoleById, roleController.delete);

  // Search routes
  router.route('/search/users')
    .get(validateQuery, searchController.searchUser);

  router.route('/search/documents')
    .get(validateQuery, searchController.searchDocument);

  // User routes
  router.route('/users/login')
    .post(validateLogin, userController.login);

  router.route('/users/logout')
    .post(userController.logout);

  router.route('/users')
    .get(isAdministrator, validateLimitAndOffset, userController.getAll)
    .post(validateUser, userController.create);

  router.route('/users/:id')
    .get(validateParam, findUserById, userController.getOne)
    .put(validateParam, findUserById, userController.update)
    .delete(validateParam, findUserById, userController.delete);

  router.route('/users/:id/documents')
    .get(validateParam,
      findUserById, validateLimitAndOffset, userController.getUserDocuments);
};

export default routes;

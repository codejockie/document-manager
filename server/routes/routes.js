import documentController from '../controllers/documentController';
import roleController from '../controllers/roleController';
import searchController from '../controllers/searchController';
import userController from '../controllers/userController';
import middleware from '../middleware/middleware';

const routes = (router) => {
  // Document routes
  router.route('/documents')
    .get(middleware.authenticate, middleware.validateLimitAndOffset, documentController.getAll)
    .post(middleware.authenticate, middleware.validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(middleware.authenticate,
      middleware.validateParam, middleware.findDocumentById, documentController.getOne)
    .put(middleware.authenticate,
      middleware.validateParam, middleware.findDocumentById, documentController.update)
    .delete(middleware.authenticate,
      middleware.validateParam, middleware.findDocumentById, documentController.delete);

  // Role routes
  router.route('/roles')
    .get(middleware.authenticate,
      middleware.isAdministrator, roleController.getAll)
    .post(middleware.authenticate,
      middleware.isAdministrator, middleware.validateRole, roleController.create);

  router.route('/roles/:id')
    .get(middleware.authenticate, middleware.isAdministrator,
      middleware.validateParam, middleware.findRoleById, roleController.getOne)
    .put(middleware.authenticate, middleware.isAdministrator,
      middleware.validateParam, middleware.findRoleById, roleController.update)
    .delete(middleware.authenticate, middleware.isAdministrator,
      middleware.validateParam, middleware.findRoleById, roleController.delete);

  // Search routes
  router.route('/search/users')
    .get(middleware.authenticate, middleware.validateQuery, searchController.searchUser);

  router.route('/search/documents')
    .get(middleware.authenticate, middleware.validateQuery, searchController.searchDocument);

  // User routes
  router.route('/users/login')
    .post(middleware.validateLogin, userController.login);

  router.route('/users/logout')
    .post(userController.logout);

  router.route('/users')
    .get(middleware.authenticate,
      middleware.isAdministrator, middleware.validateLimitAndOffset, userController.getAll)
    .post(middleware.validateUser, userController.create);

  router.route('/users/:id')
    .get(middleware.authenticate,
      middleware.validateParam, middleware.findUserById, userController.getOne)
    .put(middleware.authenticate,
      middleware.validateParam, middleware.findUserById, userController.update)
    .delete(middleware.authenticate,
      middleware.validateParam, middleware.findUserById, userController.delete);

  router.route('/users/:id/documents')
    .get(middleware.authenticate, middleware.validateParam,
      middleware.findUserById, middleware.validateLimitAndOffset, userController.getUserDocuments);
};

export default routes;

import documentController from '../controllers/documents';
import roleController from '../controllers/roles';
import searchController from '../controllers/search';
import userController from '../controllers/users';
import m from '../middleware/middleware';

const routes = (router) => {
  // Document routes
  router.route('/documents')
    .get(m.authenticate, m.validateLimitAndOffset, documentController.getAll)
    .post(m.authenticate, m.validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(m.authenticate, m.validateParam, m.findDocumentById, documentController.getOne)
    .put(m.authenticate, m.validateParam, m.findDocumentById, documentController.update)
    .delete(m.authenticate, m.validateParam, m.findDocumentById, documentController.delete);

  // Role routes
  router.route('/roles')
    .get(m.authenticate, m.isAdministrator, roleController.getAll)
    .post(m.authenticate, m.isAdministrator, m.validateRole, roleController.create);

  router.route('/roles/:id')
    .get(m.authenticate, m.isAdministrator,
      m.validateParam, m.findRoleById, roleController.getOne)
    .put(m.authenticate, m.isAdministrator,
      m.validateParam, m.findRoleById, roleController.update)
    .delete(m.authenticate, m.isAdministrator,
      m.validateParam, m.findRoleById, roleController.delete);

  // Search route
  router.route('/search/users')
    .get(m.validateQuery, searchController.searchUser);

  router.route('/search/documents')
    .get(m.validateQuery, searchController.searchDocument);

  // User routes
  router.route('/users/login')
    .post(m.validateLogin, userController.login);

  router.route('/users/logout')
    .post(userController.logout);

  router.route('/users')
    .get(m.authenticate, m.isAdministrator, m.validateLimitAndOffset, userController.getAll)
    .post(m.validateUser, userController.signup);

  router.route('/users/:id')
    .get(m.authenticate, m.validateParam, m.findUserById, userController.getOne)
    .put(m.authenticate, m.validateParam, m.findUserById, userController.update)
    .delete(m.authenticate, m.validateParam, m.findUserById, userController.delete);

  router.route('/users/:id/documents')
    .get(m.authenticate, m.validateParam, m.findUserById, userController.getUserDocuments);
};

export default routes;

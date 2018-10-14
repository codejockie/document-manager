import DocumentController from '../controllers/DocumentController';
import RoleController from '../controllers/RoleController';
import searchController from '../controllers/searchController';
import userController from '../controllers/userController';
import {
  findDocumentById,
  findRoleById,
  findUserById,
  isAdministrator,
  validateDocument,
  validateLimitAndOffset,
  validateParam,
  validateQuery,
  validateRole,
} from '../middleware/middleware';

const {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument
} = DocumentController;

const {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole
} = RoleController;

const {
  searchDocument,
  searchUser
} = searchController;

const {
  deleteUser,
  getUser,
  getUserDocuments,
  getUsers,
  updateUser
} = userController;

const routes = (router) => {
  // Document routes
  router.route('/documents')
    .get(validateLimitAndOffset, getDocuments)
    .post(validateDocument, createDocument);

  router.route('/documents/:id')
    .delete(validateParam, findDocumentById, deleteDocument)
    .get(validateParam, findDocumentById, getDocument)
    .put(validateParam, findDocumentById, updateDocument);

  // Role routes
  router.route('/roles')
    .get(isAdministrator, getRoles)
    .post(isAdministrator, validateRole, createRole);

  router.route('/roles/:id')
    .delete(isAdministrator, validateParam, findRoleById, deleteRole)
    .get(isAdministrator, validateParam, findRoleById, getRole)
    .put(isAdministrator, validateParam, findRoleById, updateRole);

  // Search routes
  router.route('/search/documents')
    .get(validateQuery, searchDocument);

  router.route('/search/users')
    .get(validateQuery, searchUser);

  // User routes
  router.route('/users')
    .get(isAdministrator, validateLimitAndOffset, getUsers);

  router.route('/users/:id')
    .delete(validateParam, findUserById, deleteUser)
    .get(validateParam, findUserById, getUser)
    .put(validateParam, findUserById, updateUser);

  router.route('/users/:id/documents')
    .get(validateParam, findUserById, validateLimitAndOffset, getUserDocuments);
};

export default routes;

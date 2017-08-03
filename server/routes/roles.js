import rolesController from '../controllers/roles';
import { authenticate, isAdministrator, validateParam, validateRole } from '../middleware/middleware';

const roleRoutes = (router) => {
  router.route('/roles')
    .get(authenticate, isAdministrator, rolesController.getAll)
    .post(authenticate, isAdministrator, validateRole, rolesController.create);

  router.route('/roles/:id')
    .get(authenticate, isAdministrator, validateParam, rolesController.getOne)
    .put(authenticate, isAdministrator, validateParam, rolesController.update)
    .delete(authenticate, isAdministrator, validateParam, rolesController.delete);
};

export default roleRoutes;

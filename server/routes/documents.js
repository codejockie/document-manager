import documentController from '../controllers/documents';
import { authenticate, validateDocument, validateParam } from '../middleware/middleware';

const documentRoutes = (router) => {
  router.route('/documents')
    .get(authenticate, documentController.getAll)
    .post(authenticate, validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(authenticate, validateParam, documentController.getOne)
    .put(authenticate, validateParam, documentController.update)
    .delete(authenticate, validateParam, documentController.delete);
};

export default documentRoutes;

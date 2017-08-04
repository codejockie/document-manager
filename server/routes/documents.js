import documentController from '../controllers/documents';
import { authenticate, findDocumentById, validateDocument, validateParam } from '../middleware/middleware';

const documentRoutes = (router) => {
  router.route('/documents')
    .get(authenticate, documentController.getAll)
    .post(authenticate, validateDocument, documentController.create);

  router.route('/documents/:id')
    .get(authenticate, validateParam, findDocumentById, documentController.getOne)
    .put(authenticate, validateParam, findDocumentById, documentController.update)
    .delete(authenticate, validateParam, findDocumentById, documentController.delete);
};

export default documentRoutes;

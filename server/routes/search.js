import searchController from '../controllers/search';
import { validateQuery } from '../middleware/middleware';

const searchRoutes = (router) => {
  router.route('/search/users')
    .get(validateQuery, searchController.searchUser);

  router.route('/search/documents')
    .get(validateQuery, searchController.searchDocument);
};

export default searchRoutes;

import documentRoutes from './documents';
import roleRoutes from './roles';
import searchRoutes from './search';
import userRoutes from './users';

export default (router) => {
  documentRoutes(router);
  roleRoutes(router);
  searchRoutes(router);
  userRoutes(router);
};

import routes from './routes';
import authRoutes from './authRoutes';

export default (router) => {
  authRoutes(router);
  routes(router);
};

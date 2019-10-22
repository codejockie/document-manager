import routes from './routes';
import auth from './auth';

export default (router) => {
  auth(router);
  routes(router);
};

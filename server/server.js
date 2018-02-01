import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import validator from 'express-validator';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack.config.babel';
import routes from './routes';
import { authenticate } from './middleware/middleware';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

const app = express();
const router = express.Router();
const distDir = path.join(__dirname, 'client/assets'),
  htmlFile = path.join(distDir, 'index.html'),
  compiler = webpack(config),
  isDevelopment = process.env.NODE_ENV === 'development';

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

if (isDevelopment) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
} else {
  // Set public directory
  app.use(express.static(distDir));
}

// Configure routes
routes(router);
app.use('/v1/auth', router);
app.use('/v1', authenticate, router);

app.get('/', (req, res) => {
  res.status(200).render(htmlFile);
});

app.get('*', (req, res) => {
  res.redirect(302, '/');
});

app.listen(process.env.PORT || '4200');

export default app;

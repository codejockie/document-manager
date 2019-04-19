import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import validator from 'express-validator';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { authenticate } from './middleware/middleware';
import webpackConfig from '../webpack.config.babel';
import routes from './routes';

// Configure dotenv to load environment variables
dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4200;
const router = express.Router();
const config = webpackConfig(undefined, { mode: 'development' });

// Set static directory and webpack config
const distDir = path.join(__dirname, '../client/assets');
const htmlFile = path.join(distDir, 'index.html');
const compiler = webpack(config);

// Configure middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(validator());

if (NODE_ENV === 'development') {
  // Configure webpack middleware for bundling
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
} else {
  // Set public directory
  app.use(express.static(distDir));
}

// Enable CORS
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configure routes
routes(router);
app.use('/v1/auth', router);
app.use('/v1', authenticate, router);

app.get('*', (request, response) => {
  response.status(200).sendFile(htmlFile);
});

app.listen(PORT);

export default app;

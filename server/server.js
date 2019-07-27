import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import webpack from 'webpack';
import validator from 'express-validator';
import { json, urlencoded } from 'body-parser';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import enableRoutes from './routes';
import webpackConfig from '../webpack.config.babel';
import { authenticate } from './middleware/middleware';

// Configure dotenv to load environment variables
dotenv.config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 4200;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Set static directory
const distDir = path.join(__dirname, '../client/assets');
const htmlFile = path.join(distDir, 'index.html');
const docsDir = path.resolve(__dirname, '../public');
const docsHtmlFile = path.join(docsDir, 'index.html');

// Configure middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(validator());

if (NODE_ENV === 'development') {
  const config = webpackConfig(undefined, { mode: 'development' });
  const compiler = webpack(config);
  // Configure webpack middleware for bundling
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
} else {
  // Set public directory
  app.use(express.static(distDir));
  app.use(express.static(docsDir));

  app.get('/docs', (request, response) => response.sendFile(docsHtmlFile));
}

// Enable CORS
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configure routes
enableRoutes(router);
app.use('/v1/auth', router);
app.use('/v1', authenticate, router);

app.get('*', (request, response) => {
  response.status(200).sendFile(htmlFile);
});

app.listen(PORT, () => { console.info(`🚀 App listening on ${PORT}`); });

export default app;

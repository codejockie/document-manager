import path from 'path';
import webpack from 'webpack';

const DEVELOPMENT_ENV = 'development';
const PRODUCTION_ENV = 'production';

const resolvePath = dir => path.resolve(__dirname, dir);

const getEntry = ({ mode }) => {
  if (mode === DEVELOPMENT_ENV) {
    return [
      'webpack-hot-middleware/client?reload=truepath=//localhost:4200/__webpack_hmr',
      './client/src/index.js'
    ];
  }
  return {
    main: './client/src/index.js'
  };
};

const getEnvPlugins = ({ mode }) => {
  if (mode === PRODUCTION_ENV) {
    return [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(PRODUCTION_ENV)
        }
      })
    ];
  }
  // Excluding hot module in production fixes
  // EventSource's response has a MIME type ('text/html')
  // that is not 'text/event-stream'. Aborting the connection. error
  return [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(DEVELOPMENT_ENV)
      }
    })
  ];
};

const getFileName = ({ mode }) => {
  if (mode === DEVELOPMENT_ENV) {
    return '[name].[hash].js';
  }
  return '[name].[chunkhash].js';
};

export {
  getEntry, getEnvPlugins, getFileName, resolvePath
};

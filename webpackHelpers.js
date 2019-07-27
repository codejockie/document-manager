import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const DEVELOPMENT_ENV = 'development';
export const PRODUCTION_ENV = 'production';

export const resolvePath = dir => path.resolve(__dirname, dir);
export const getDevTool = ({ mode }) => (mode === DEVELOPMENT_ENV ? 'cheap-module-eval-sourcemap' : 'source-map');
export const getStyleLoaders = ({ mode }) => {
  if (mode === DEVELOPMENT_ENV) {
    return ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
  }
  return [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'];
};

export const getEntry = ({ mode }) => {
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

export const getEnvPlugins = ({ mode }) => {
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

export const getFileName = ({ mode }) => {
  if (mode === DEVELOPMENT_ENV) {
    return '[name].[hash].js';
  }
  return '[name].[chunkhash].js';
};

export const getOptimisers = ({ mode }) => {
  if (mode !== PRODUCTION_ENV) {
    return {
      optimization: {
        minimize: false
      }
    };
  }

  return {
    optimization: {
      minimize: true,
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
  };
};

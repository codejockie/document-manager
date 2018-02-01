import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

let appName = 'bundle';
const entry =  [
  'webpack-hot-middleware/client',
  './client/index.js'
];
const nodeEnv = process.env.NODE_ENV;
const webpackEnv = process.env.WEBPACK_ENV;
const outputPath = path.resolve(__dirname, 'client/assets');

const config = {
  entry,
  externals: {
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react'
  },
  output: {
    path: outputPath,
    filename: appName,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /(\.js$)/,
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, 'client'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'env']
            }
          }
        ]
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Document Manager',
      template: 'client/assets/template.html'
    })
  ]
};

if (webpackEnv === 'production' || nodeEnv === 'production') {
  const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

  config.plugins.push(new UglifyJsPlugin({ minimize: true }));
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: 'production'
    }
  }));

  config.devtool = 'source-map'
  config.output.filename += '.min.js';
} else {
  config.devtool = 'cheap-module-eval-sourcemap';
  config.output.filename += '.js';
}

export default config;
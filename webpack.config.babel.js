import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {
  getDevTool, getEntry, getEnvPlugins, getFileName, getOptimisers, getStyleLoaders, resolvePath
} from './webpackHelpers';

export default (_, argv) => ({
  devtool: getDevTool(argv),
  entry: getEntry(argv),
  externals: {
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react'
  },
  output: {
    path: resolvePath('client/assets'),
    filename: getFileName(argv),
    chunkFilename: getFileName(argv),
    publicPath: '/'
  },
  mode: argv.mode,
  module: {
    rules: [
      {
        test: /(\.js$)/,
        exclude: /node_modules/,
        include: resolvePath('client/src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.(c|sa|sc)ss$/,
        use: getStyleLoaders(argv),
      },
      {
        test: /\.(gif|jpe?g|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/images/[name].[hash:4].[ext]'
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/fonts/[name].[hash:4].[ext]'
          }
        }
      },
      {
        test: /\.(aac|flac|mkv|mp3|mp4|ogg|wma|wmv)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/media/[name].[hash:4].[ext]'
          }
        }
      }
    ]
  },
  ...getOptimisers(argv),
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [__dirname, 'client/src', 'node_modules'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      title: 'Document Manager',
      template: 'client/template.html'
    }),
    ...getEnvPlugins(argv)
  ]
});

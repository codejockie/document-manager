import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import WebpackMd5Hash from 'webpack-md5-hash';

const DEVELOPMENT_ENV = 'development';
const PRODUCTION_ENV = 'production';
const resolvePath = dir => path.resolve(__dirname, dir);
const outputPath = resolvePath('client/assets');
const getEntry = ({ mode }) => {
  if (mode === DEVELOPMENT_ENV) {
    return [
      'webpack-hot-middleware/client?reload=truepath=//localhost:4200/__webpack_hmr',
      './client/src/index.js'
    ];
  }
  return { main: './client/src/index.js' };
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

export default (_, argv) => ({
  devtool: argv.mode === DEVELOPMENT_ENV ? 'cheap-module-eval-sourcemap' : 'source-map',
  entry: getEntry(argv),
  externals: {
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react'
  },
  output: {
    path: outputPath,
    filename: getFileName(argv),
    chunkFilename: getFileName(argv),
    publicPath: '/'
  },
  mode: argv.mode,
  module: {
    rules: [
      {
        test: /(\.js$)/,
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
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
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
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      title: 'Document Manager',
      template: 'client/template.html'
    }),
    new WebpackMd5Hash(),
    ...getEnvPlugins(argv)
  ]
});

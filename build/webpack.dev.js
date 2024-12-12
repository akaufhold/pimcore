import path from 'path';
import { fileURLToPath } from 'url';

import StyleLintPlugin from "stylelint-bare-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// define project to build
let _project = {
	type: 'static',
	template: 'pimcore'
};

// require config file
import * as _config from './webpack/config.json' assert { type: 'json' };

export default {
  stats: {
    warnings: false
  },
  // Define the entry points of our application
  entry: {
    ckeditor: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + '/ckeditor.js',
    home: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + '/home.js',
    sub: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + './sub.js',
    backend: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + './backend.js',
    // Modules
    wasteCalculator: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + 'features/waste_calculator.js',
    slimslider: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + 'slimslider/slimSlider.js',
  },
  
  // Define the destination directory and filenames of compiled resources and files
  output: {
    filename: _config.default[_project.type].paths.public.javascripts+'[name].js',
    path: path.resolve(__dirname, _config.default[_project.type].webpack.paths.public),
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  cache: {
    type: 'filesystem',
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000, // falls notwendig
  },
  // Define development options
  devtool: 'eval-cheap-module-source-map',
  // Define loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3, // Amount of worker threads
            },
          },
          'babel-loader', // JS-Transpilation
        ],
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: false,
              url: true,
              esModule: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ]
              },
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                quietDeps: true,
                silenceDeprecations: ['import'],
              },
            },
          },
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset/resource',
        generator: {
          filename: 'Images/[name][ext]'
        }
      },
      {
        test: [/\.woff$/, /\.woff2$/],
        type: 'asset/resource',
        generator: {
          filename: 'Fonts/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    // Linting JS files 
    new ESLintPlugin({
      failOnError: true,
      fix: true
    }),

    // Linting SCSS files 
    new StyleLintPlugin({
      configFile: 'stylelint.config.cjs',
      context: 'Assets',
      files: '**/*.s?(a|c)ss',
      failOnError: false,
      emitErrors: true,
      fix: true
    }),

    // Copy static assets
    new CopyPlugin({
      patterns: [
        {
          from: './assets/static', 
          to: './',
          noErrorOnMissing: true
        }
      ]
    }),

    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: _config.default[_project.type].paths.public.stylesheets+'[name].css',
      chunkFilename: '[id].css'
    }),

    new FixStyleOnlyEntriesPlugin(),

    new WebpackShellPluginNext({
      onWatchRun:{
        scripts: [
          'echo "Watcher Start"',
        ],
        blocking: false,
        parallel: false
      },
      onDoneWatch:{
        scripts: [
          //'echo "Clear Pimcore Cache"',
          //'../bin/console cache:clear',
        ],
        blocking: false,
        parallel: false
      },
    })
  ]
}
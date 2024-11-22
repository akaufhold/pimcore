import path from 'path';
import { fileURLToPath } from 'url';

import StyleLintPlugin from "stylelint-bare-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import BrowserSyncPlugin from 'webpack-shell-plugin-next';

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
  // Define the entry points of our application
  entry: {
    home: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + '/home.js',
    sub: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + './sub.js',
  },

  // Define the destination directory and filenames of compiled resources and files
  output: {
    filename: _config.default[_project.type].paths.public.javascripts+'[name].js',
    path: path.resolve(__dirname, _config.default[_project.type].webpack.paths.public),
    assetModuleFilename: '[name][ext]',
    clean: true
  },

  // Define development options
  devtool: 'source-map',

  // Define loaders
  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
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
            loader: 'sass-loader',
            options: {
              api: "modern",
              sassOptions: {
                quietDeps: true
              }
            }
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
          'echo "Clear Pimcore Cache"',
          //'bin/console pimcore:cache:clear',
        ],
        blocking: false,
        parallel: false
      },
    }),

    // Add live browser
    new BrowserSyncPlugin({
      host: 'pimcore.ddev.site',
      //  port: 54011,
      // browse to http://localhost:3001/ during development,
      https: true,
      proxy: 'https://pimcore.ddev.site',
      online: true,
      reloadOnRestart: true,
      notify: false,
      files: [{
        match: [
          '**/*.css',
          '**/*.js',
          '**/*.html',
          '**/*.php',
        ],
        fn: function(event, file) {
          if (event === 'change') {
            const bs = require('browser-sync').get('bs-webpack-plugin');
            bs.reload();
          }
        },
      }]
      // logLevel: "debug"
    })
  ]
}
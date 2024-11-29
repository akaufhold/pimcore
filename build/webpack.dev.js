import path from 'path';
import { fileURLToPath } from 'url';

import StyleLintPlugin from "stylelint-bare-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import WatchExternalFilesPluginModule from 'webpack-watch-files-plugin';
const WatchExternalFilesPlugin = WatchExternalFilesPluginModule.default;

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
    warningsFilter: /DeprecationWarning/,
  },
  // Define the entry points of our application
  entry: {
    home: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + '/home.js',
    sub: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + './sub.js',
    backend: _config.default[_project.type].webpack.paths.assetsRoot + '/' +  _config.default[_project.type].webpack.paths.assets.javascripts + './backend.js',
  },

  // Define the destination directory and filenames of compiled resources and files
  output: {
    filename: _config.default[_project.type].paths.public.javascripts+'[name].js',
    path: path.resolve(__dirname, _config.default[_project.type].webpack.paths.public),
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  cache: false,
  // Define development options
  devtool: 'source-map',
  stats: 'errors-only',
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
          'echo "Clear Pimcore Cache"',
          '../bin/console cache:clear',
        ],
        blocking: false,
        parallel: false
      },
    }),

    // Add live browser
    new BrowserSyncPlugin({
      host: 'pimcore.ddev.site',
      port: 3003,
      // browse to http://localhost:3001/ during development,
      https: true,
      proxy: 'https://pimcore.ddev.site',
      //server: { baseDir: ['public'] },
      online: true,
      reloadOnRestart: false,
      scrollProportionally: false,
      notify: false,
      advanced: {
        browserSync: {
          logLevel: 'debug',
        },
      },
      files: [{
        match: [
          '**/*.html',
          '**/*.html.twig',
          '**/*.css',
          '**/*.js',
        ]
      }],
      logLevel: "debug"
    }),
    
    new WatchExternalFilesPlugin({
      files: [
        '**/*.html',
        '**/*.html.twig',
      ]
    })
  ]
}
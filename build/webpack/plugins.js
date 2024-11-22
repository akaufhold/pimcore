/* global
    require, module
*/
import StyleLintPlugin from "stylelint-bare-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

const plugins = {
    StyleLintPlugin: new StyleLintPlugin({
    configFile: 'stylelint.config.cjs',
    context: 'Assets',
    files: '**/*.s?(a|c)ss',
    failOnError: true,
    emitErrors: true,
    fix: true
  }),
  ESLintPlugin: new ESLintPlugin({
    failOnError: true
  }),
  CopyPlugin: new CopyPlugin({
    patterns: [
      {from: './Assets/Static', to: './'}
    ]
  }),
  MiniCssExtractPlugin: new MiniCssExtractPlugin({
    filename: 'StyleSheets/[name].css',
    chunkFilename: '[id].css'
  }),
  FixStyleOnlyEntriesPlugin: new FixStyleOnlyEntriesPlugin()
}

// Add Webpack Hooks before and after asset building
/*
new WebpackShellPluginNext({
  onWatchRun: {
    scripts: [
      'echo "Watcher Start"',
    ],
    blocking: false,
    parallel: false
  },
  onDoneWatch: {
    scripts: [
      'echo "Clear Typo3 Cache"',
      // 'ddev app-typo3cms cache:flush',
      'echo "Typo3 Cache Ready"',
      'echo "Watcher End"'
    ],
    blocking: false,
    parallel: false
  },
}),

// Add live browser
new BrowserSyncPlugin({
  // host: 'bmas-sgb2.pixelpark.docker',
  // port: 54011,
  // browse to http://localhost:3001/ during development,
  https: true,
  proxy: 'https://bmas-sgb2.pixelpark.docker',
  online: true,
  reloadOnRestart: false,
  notify: false
  // logLevel: "debug"
})
*/

export default plugins;
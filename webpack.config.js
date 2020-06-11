const baseConfig = require('./webpack.base.config');

const webConfig = Object.assign({}, baseConfig, {
  target: 'web',
  output: {
    ...baseConfig.output,
    libraryTarget: 'umd',
    library: 'Dash',
    filename: 'dash.min.js',
    // fixes ReferenceError: window is not defined
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  }
});
const es5Config = Object.assign({}, baseConfig, {
  target: 'node',
  optimization: {
    minimize: false
  },
  devtool: 'inline-source-map',
  output: {
    ...baseConfig.output,
    filename: 'dash.cjs.js',
    libraryTarget: 'commonjs2'
  },
});
module.exports = [webConfig, es5Config]

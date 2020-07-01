const path = require('path');

const webConfig =  {
  entry: './build/src/index.js',
  mode: "production",
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    // Prevent embedded winston to throw error with FS not existing.
    fs: 'empty',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'Dash',
    filename: 'dash.min.js',
    // fixes ReferenceError: window is not defined
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      'bn.js': path.resolve(__dirname, 'node_modules', 'bn.js')
    }
  },
}

module.exports = webConfig;

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/client/index.js',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'public/lib'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react']
        }
      }
    ]
  }
};

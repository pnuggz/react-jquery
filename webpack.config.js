const path = require('path');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');

const packageJSON = require('./package.json');
const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

module.exports = {
  cache: true,
  entry: src + '/index.js',
  output: {
    library: 'LazyDOM',
    libraryTarget: 'umd',
    path: dist,
    filename: packageJSON + '.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      include: src
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  plugins: [
    new Clean(['dist'])
  ]
};

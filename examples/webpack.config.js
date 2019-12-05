var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

var lazyDOMDir = path.join(__dirname, 'lazy-dom');
var reactDir = path.join(__dirname, 'react');

function findEntries(rootDir) {
  return fs.readdirSync(rootDir).reduce(function (entries, dir) {
    if (fs.statSync(path.join(rootDir, dir)).isDirectory()) {
      entries[path.basename(rootDir) + '/' + dir] = path.join(rootDir, dir, 'app.js');
    }
    return entries;
  }, {});
}

module.exports = {
  devtool: 'inline-source-map',
  entry: Object.assign({
    'lazy-dom-polyfill': './src/polyfill.js',
  }, findEntries(lazyDOMDir), findEntries(reactDir)),
  output: {
    path: __dirname + '/__build__',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },
      { 
        test: /\.json$/, 
        loader: "json-loader" 
      }
    ]
  },
  resolve: {
    alias: {
      'lazy-dom': path.join(__dirname, '..', 'src')
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-dom/server': 'ReactDOMServer'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};

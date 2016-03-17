var express = require('express');
var rewrite = require('express-urlrewrite');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackConfig = require('./webpack.config');

var app = express();

app.use(
  webpackDevMiddleware(
    webpack(WebpackConfig), {
      publicPath: '/__build__/',
      stats: {
        colors: true
      }
    }
  )
);

var fs = require('fs');
var path = require('path');

var lazyDOMDir = path.join(__dirname, 'lazy-dom');
var reactDir = path.join(__dirname, 'react');

function serveDir(rootDir) {
  fs.readdirSync(rootDir).forEach(function (file) {
    if (fs.statSync(path.join(rootDir, file)).isDirectory()) {
      app.use(
        rewrite('/' + file + '/*', '/' + file + '/index.html')
      );
    }
  });
}

serveDir(lazyDOMDir);
serveDir(reactDir);

app.use(express.static(__dirname));

app.listen(8080, function () {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop');
});

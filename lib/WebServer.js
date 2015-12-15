'use strict';

/**
 * WebServer.js: exports a WebServer singleton object
 */

// Node.js core modules
var http = require('http');
var path = require('path');
var fs = require('fs');

// Installed dependencies
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var SocketIo = require('socket.io');

/**
 * Module variables
 */
var app = express();
var server = http.createServer(app);
var io = SocketIo(server);
var routes = [];

/**
 * Configure the express app
 */

// Get port from environment or use default 3000
app.set('port', process.env.PORT || 3000);

// Console log all http requests
app.use(logger('dev'));

// view engine setup. Looks for "views" subdirectory in current working directory
app.set('view engine', 'jade');
app.set('views', path.join(process.cwd(), 'views'));

// Put POST data into request.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Load all routes in *.js files in ../routes
// NOTE: does NOT recurse down into sub-directories
const routesDir = path.join(__dirname, '..', 'routes');
fs.readdirSync(routesDir)

  .filter(fileName => fileName.includes('.js'))

  .forEach(fileName => {

    require(path.join(routesDir, fileName)).forEach(addRoute);

  });

// Mount static "public" directory
addStatic('/', path.join(__dirname, '..', 'public'));

// Mount front-end libraries
addLib('angular/angular.min.js');
addLib('angular-route/angular-route.min.js');
addLib('bootstrap/dist/css/bootstrap.min.css');

// attach error handler for http server
server.on('error', (error) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  var portString = 'Port ' + app.get('port');

  // handle specific listen errors with friendly messages
  switch (error.code) {

    case 'EACCES':
      console.error(portString + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(portString + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;

  }
});

/**
 * Applies 404 and 505 catchall routes (must go last) and starts the server
 * @param done
 */
function start(done) {

  done = done || function() {};

  // catch requests for non-existent routes and respond with 404 "not found"
  app.use((req, res) => {
    res.status(404);
    res.render('404', {
      path: req.url,
      method: req.method
    });
  });

  // Internal server error
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: err
    });
  });

  server.listen(app.get('port'), () => {
    console.log('Listening on http://localhost:' + app.get('port'));
    io.on('connection', (socket) => {
      console.log('Connected socket.io client ' + socket.id);
      socket.on('buzz', (name) => {
        console.log(name + ' buzzed');
        io.emit('buzz', name);
      })
    });
    done();
  });

}

/**
 * Stops the http server
 * @param done
 */
function stop(done) {
  server.close(done);
}

/**
 *
 * @param url
 * @param path
 */
function addStatic(url, path) {
  app.use(url, express.static(path));
}

/**
 *
 * @param route
 */
function addRoute(route) {
  app[route.method](route.path, route.handler);
  routes.push(route);
}

/**
 *
 * @param rpath
 */
function addLib(rpath) {
  var baseDir = path.join(__dirname, '..', 'node_modules');
  addRoute({
    path: '/lib' + '/' + path.basename(rpath),
    method: 'get',
    handler(req, res) {
      res.sendFile(path.join(baseDir, rpath));
    }
  });
}

module.exports = {

  app,
  server,
  routes,
  addRoute,
  addStatic,
  addLib,
  start,
  stop

};



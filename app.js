'use strict';

/*
 * app.js: exports an express app
 */

// Node.js core modules
var http = require('http');
var path = require('path');
var fs = require('fs');

// Installed dependencies
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');

// Local dependencies
var pkg = require('./package.json');

// Module variables
var app = express();
var server = http.createServer(app);
var io = socketIo(server);
var buzzes = [];

// Get port from environment or use default 3000
app.set('port', process.env.PORT || 3000);

// Convenience method for starting the server in bin/www.js
app.start = () => {
  server.listen(app.get('port'));
};

// log to console all http requests
app.use(logger('dev'));

// View engine setup for res.render(<view name>.pug, context);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Parse JSON http request bodies and attach to the request object as req.body
app.use(bodyParser.json());

// Parse x-www-form-urlencoded http request bodies and attach to the request object as req.body
app.use(bodyParser.urlencoded({extended: false}));

// Serve files in ./public
app.use('/', express.static(path.join(__dirname, 'public')));

// GET '/'
app.get('/', (req, res) => {
  res.render('index', { title: pkg.name });
});

// Adds a GET route for Angular library in ./node_modules
app.get('/lib/angular.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'angular', 'angular.min.js'));
});

/*
  404 "Resource not found" middleware. Should be 2nd-to-last route definition
 */
app.use((req, res) => {
  res.status(404);
  res.render('404', {
    path: req.url,
    method: req.method
  });
});

/* 
  500 "Internal server error" middleware catches new Error objects in routes
  */
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('500', {
    message: err.message,
    error: err
  });
});

/*
  Attach error handler for http server
 */
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

/*
  Attach "listen" event handler
 */
server.on('listening', () => {

  console.log('Listening on http://localhost:' + app.get('port'));

});

/*
  Attach "connection" event handler to socket.io server
 */
io.on('connection', (socket) => {

  console.log('Connected socket.io client ' + socket.id);

  // Broadcast current list of buzzes
  buzzes.forEach((name) => socket.emit('buzz', name));

  // Handler for "buzz" socket events
  socket.on('buzz', (name) => {
    // No double-buzzes
    if (buzzes.indexOf(name) === -1) {
      // Store buzz
      buzzes.push(name);
      // re-broadcast event to other connected sockets
      io.emit('buzz', name);
    }
  });

  // Handler for "reset" socket event
  socket.on('reset', () => {
    // reset buzzes Array
    buzzes = [];
    // re-broadcast to other connected sockets
    io.emit('reset');
  });

});

module.exports = app;

'use strict';

/**
 * app.js: Defines an Angular app
 */

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', function($scope) {

  // Model fields
  $scope.name = ''; // "Name" input
  $scope.buzzes = []; // Array of buzzes received

  // io is a global defined by /socket.io/socket.io.js
  var socket = io();

  // Click handler for buzz button
  $scope.buzz = () => {
    socket.emit('buzz', $scope.name);
  };

  // Handler for incoming buzz events
  socket.on('buzz', (name) => {
    // only add name to buzzes array once
    if ($scope.buzzes.indexOf(name) === -1) $scope.buzzes.push(name);
    // force re-render
    $scope.$apply();
  });

  // Click handler for Reset button
  $scope.reset = () => {
    socket.emit('reset');
  };

  // Handler for incoming 'reset' events
  socket.on('reset', () => {
    $scope.buzzes = [];
    // force re-render
    $scope.$apply();
  });

}]);

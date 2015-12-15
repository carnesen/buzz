'use strict';

var app = angular.module('app', ['ngRoute']);

app.controller('ctrl', ['$scope', '$http', function($scope) {

  $scope.buzzes = [];

  $scope.name = '';

  var socket = io();

  socket.on('reset', () => {
    $scope.buzzes = [];
  });

  socket.on('buzz', (name) => {
    if ($scope.buzzes.indexOf(name) === -1) {
      console.log(name + ' buzzed');
      $scope.buzzes.push(name);
    }
  });

  $scope.buzz = () => {
    socket.emit('buzz', $scope.name);
  };

}]);

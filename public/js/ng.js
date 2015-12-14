var app = angular.module('app', []);

app.controller('ctrl', ['$scope', function ($scope) {

  $scope.user = {
    email: 'asdf',
    password: ''
  };

  $scope.samplePasswords = ['asdfiowjefawe', '42tqdf9', 'asdfasd', 'asdfj'];

}]);
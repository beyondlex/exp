'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$http','$scope', function($http, $scope) {
//    $http.get('/users').success(function(data){
//        $scope.users = data;
//    });

    $http.get('/users').then(function(res){
        $scope.users = res.data.users;
    });
}]);
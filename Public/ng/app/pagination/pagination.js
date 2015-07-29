'use strict';

angular.module('myApp.pagination', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pagination', {
            templateUrl: 'pagination/pagination.html',
            controller: 'PaginationDemoCtrl'
        });
    }])

    .controller('PaginationDemoCtrl', function ($scope, $log) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
});
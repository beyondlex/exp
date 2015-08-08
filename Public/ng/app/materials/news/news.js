'use strict';

angular.module('myApp.materials-news', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/materials/news', {
                templateUrl: 'materials/news/news.html',
                controller: 'NewsCtrl'
            })
        ;


    }])
    .controller('NewsCtrl', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
        $scope.toBeDelete = undefined;

        $scope.itemsPerPage = 4;
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.search();
        };


        $scope.search = function() {

            $scope.selectedImg = undefined;//reset chosen one

            $scope.extraParams = $scope.searchKey ? {searchKey: $scope.searchKey} : undefined;

            //获取imgtxts 列表
            $http.post('/api/imgtxts/'+$scope.currentPage+'/'+$scope.itemsPerPage, $scope.extraParams)
                .then(function(res){
                    $scope.imgtxts = res.data.data;
                    $scope.totalItems = res.data.total;
                }, function() {

                });
        };

        $scope.searchByKey = function(event) {
            if (event.keyCode == 13) {
                $scope.search();
            }
        };


        $scope.search();



    }]);
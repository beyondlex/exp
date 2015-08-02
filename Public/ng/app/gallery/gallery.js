'use strict';

angular.module('myApp.gallery', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/gallery', {
                templateUrl: 'gallery/gallery.html',
                controller: 'GalleryCtrl'
            })
            ;

    }])

    .controller('GalleryCtrl', ['$scope', '$http', 'Images', function($scope, $http, Images) {


        $scope.itemsPerPage = 12;
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.search();
        };


        $scope.getImages = function() {

            console.log($scope.currentPage);

            $http.get('/api/images/'+$scope.currentPage+'/'+$scope.itemsPerPage)

                .then(function(res){
                    $scope.imgs = res.data.data;
                    $scope.totalItems = res.data.total;
                }, function() {

                });
        };

        $scope.search = function() {
            console.log($scope.currentPage);

            $scope.selectedImg = undefined;//reset chosen one


            Images.getImages($scope.currentPage, $scope.itemsPerPage)
                .then(function (res) {
                    $scope.imgs = res.data.data;
                    $scope.totalItems = res.data.total;
                    $scope.pending = false;

                }, function() {
                    $scope.pending = false;
                }
            );
        };


        $scope.flowSuccess = function($file, $message, $flow) {
            //$scope.getImages();
            $scope.search();
            $scope.selectedImg = 0;//上传完后选中
        };

        //$scope.getImages();
        $scope.search();



        //$scope.imgs2 = [
        //    {
        //        id: 1,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/1.jpg"
        //    },
        //    {
        //        id: 2,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/2.jpg"
        //    },
        //    {
        //        id: 3,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/3.jpg"
        //    },
        //    {
        //        id: 4,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/4.jpg"
        //    },
        //    {
        //        id: 5,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/5.jpg"
        //    },
        //    {
        //        id: 6,
        //        imgurl: "http://ironsummitmedia.github.io/startbootstrap-creative/img/portfolio/6.jpg"
        //    }
        //
        //];
        //console.log($scope.imgs2);


    }]);
'use strict';

angular.module('myApp.imgCrop', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/imgCrop', {
                templateUrl: 'imgCrop/imgCrop.html',
                controller: 'ImgCropCtrl'
            });


    }])

    .controller('ImgCropCtrl', function($scope) {
        $scope.myImage='';
        $scope.myCroppedImage='';

        var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage=evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    });

/**
 * Created by Administrator on 2015/7/26.
 */

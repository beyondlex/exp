/**
 * Created by Administrator on 2015/7/26.
 */
'use strict';

angular.module('myApp.uploads', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/uploads', {
                templateUrl: 'uploads/uploads.html',
                controller: 'UploadsCtrl'
            });


    }])

    .controller('UploadsCtrl',  ['$scope', function($scope) {

        $scope.flowSuccess = function( $file, $message, $flow ) {
            $message = JSON.parse($message);
            if ($message['path']) {
                $scope.uploaded = $message['path'];
            }
        }


    }]);


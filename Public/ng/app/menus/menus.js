'use strict';

angular.module('myApp.menus', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/menus', {
                templateUrl: 'menus/menus.html',
                controller: 'MenusCtrl'
            })
        ;


    }])

    .controller('MenusCtrl', ['$scope', function($scope) {

        $scope.menus = [
            {
                "name": "1"
            },

            {
                "name": "2",
                "subs": [
                    {
                        "name": "2.1"
                    },
                    {
                        "name": "2.2"
                    }
                ]
            }

        ];

    }]);
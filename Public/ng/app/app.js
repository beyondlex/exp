'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ng.ueditor',
  'ngImgCrop',
  'flow',
  'myApp.view1',
  'myApp.view2',
  'myApp.modal',
  'myApp.pagination',
  'myApp.materials',
  'myApp.imgCrop',
  'myApp.uploads',
  'myApp.version',
    'ui.bootstrap'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider

            .otherwise({redirectTo: '/view1'});

}]);

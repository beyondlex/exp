'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute'
  //,'ngAnimate'
  ,'ngResource'
  ,'myApp.services'
  ,'ng.ueditor'
  ,'ngImgCrop'
  ,'flow'
  ,'myApp.view1'
  ,'myApp.view2'
  ,'myApp.modal'
  ,'myApp.pagination'
  ,'myApp.materials'
  ,'myApp.imgCrop'
  ,'myApp.uploads'
  ,'myApp.version'
  ,'myApp.alert'

    ,'myApp.gallery'

  ,'ngDialog'
  ,'myApp.ngDialog'

    ,'ui.bootstrap'
    ,'mgcrea.ngStrap'
    ,'angular-loading-bar'

]).
config(['$routeProvider', '$locationProvider', '$httpProvider',function($routeProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .otherwise({redirectTo: '/view1'});

        //调整$http的behavior，使$http.post传输到php后端的数据能被接收【nodejs作为后端时不需要】

        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
}]);

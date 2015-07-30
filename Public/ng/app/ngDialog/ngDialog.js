/**
 * Created by Administrator on 2015/7/30.
 */
'use strict';

angular.module('myApp.ngDialog', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/ngDialog', {
            templateUrl: 'ngDialog/ngDialog.html',
            controller: 'NgDialogCtrl'
        });
    }])

    .controller('NgDialogCtrl', ['$scope', 'ngDialog', function($scope, ngDialog) {

        //以模板ID打开dialog
        $scope.openTplid = function(tplId) {

             $scope.firstDialog = ngDialog.open({
                template: tplId,
                 data:{'dialog1': $scope},//配置这个参数后，则可以访问到$scope.ngDialogData
                 scope: $scope,
                controller: 'NgDialogCtrl',//需要写controller, 打开的dialog上的按钮next()才能在这个controller找到
                className: 'ngdialog-theme-plain'
                //className: 'ngdialog-theme-flat'
            });


        };

        $scope.step2 = function () {
            //ngDialog.close('ngdialog1');//打开第一个dialog时自动加上的id
            //如何关闭上一个dialog?
            //ngDialog.closeAll();

            console.log($scope.ngDialogData);
            //这里要访问上个dialog设置在$scope中的变量firstDialog
            // 需要在上个dialog open时传入scope
            console.log($scope.firstDialog);

            ngDialog.close($scope.firstDialog.id);


            $scope.secondDialog = ngDialog.open({
                template: 'dialog2',
                controller: 'NgDialogCtrl',
                className: 'ngdialog-theme-flat ngdialog-theme-custom'
            });
        };

        $scope.step1 = function() {
            ngDialog.open({
                template: 'dialog1',
                controller: 'NgDialogCtrl',
                className: 'ngdialog-theme-plain'
            });
        };


        //以文件名打开dialog
        $scope.clickToOpen = function () {
            ngDialog.open({ template: 'popupTmpl.html' });
        };

    }]);
'use strict';

angular.module('myApp.materials', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/materials/imgtxts_add', {
                templateUrl: 'materials/imgtxts/imgtxts_add.html',
                controller: 'ImgtxtsAddCtrl'
            })
            .when('/materials', {
                templateUrl: 'materials/imgtxts/imgtxts.html',
                controller: 'ImgtxtsCtrl'
            });

    }])

    .controller('ImgtxtsCtrl', ['$scope',function($scope) {

    }])
    .controller('ImgtxtsAddCtrl', [
        '$scope', '$http', 'flowFactory', '$alert', 'usSpinnerService', function($scope, $http, flowFactory, $alert, usSpinnerService) {



        $scope.startSpin = function(){
            usSpinnerService.spin('spinner-1');
        }
        $scope.stopSpin = function(){
            usSpinnerService.stop('spinner-1');
        }

        $scope.thumbFlow = flowFactory.create({
            target: '/api/imgtxt_thumb_upload',
            singleFile: true
        });


        $scope.config = {

                toolbars:[[
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                    'print', 'preview', 'searchreplace', 'help', 'drafts'
                ]],
                //focus时自动清空初始化时的内容
                autoClearinitialContent:true,
                //关闭字数统计
                wordCount:false,
                //关闭elementPath
                elementPathEnabled:false
        };

        $scope.formData = {
            title   : '',
            content : 'hello'
        };

        $scope.submitForm1 = function(valid) {
            $scope.submitted = true;//标记用户submit了

            var alertOpt = {
                content: '信息填写不完整，请检查。',
                container: 'body',
                placement: 'top-right',
                duration: 3,
                type: 'danger',//success info warning danger
                show: true
            };

            if (!valid) {
                $alert(alertOpt);
                return;
            }

            if (!$scope.thumbFlow.files.length) {
                alertOpt.content = '封面未上传';
                $alert(alertOpt);
                return;
            }

            $http.post('/api/imgtxt_formadd',$scope.formData)
                .success(function(res) {
                    console.log(res);
                });

        };


        //上传成功
        $scope.flowSuccess = function( $file, $message, $flow ) {
            $message = JSON.parse($message);
            if ($message['path']) {
                $scope.formData.uploaded = $message['path'];
            }
        };





    }]);


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
    .controller('ImgtxtsAddCtrl', ['$scope', 'flowFactory', function($scope, flowFactory) {

        $scope.thumbFlow = flowFactory.create({
            target: '/api/imgtxt_thumb_upload',
            singleFile: true
        });


        $scope.config = {
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
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

        $scope.create = function() {
            console.log($scope.formData);
        };

        $scope.delImg = function() {
            $scope.formData.image.resized.dataURL = undefined;
            $scope.formData.image = undefined;
        };

        //上传成功
        $scope.flowSuccess = function( $file, $message, $flow ) {
            $message = JSON.parse($message);
            if ($message['path']) {
                $scope.formData.uploaded = $message['path'];
            }
        };





    }]);


'use strict';

angular.module('myApp.materials', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider

            .when('/materials/imgtxts_add', {
                templateUrl: 'materials/imgtxts/imgtxts_add.html',
                controller: 'ImgtxtsAddCtrl'
            })

            .when('/materials/imgtxts_edit/:imgtxtId', {
                templateUrl: 'materials/imgtxts/imgtxts_add.html',
                controller: 'ImgtxtsAddCtrl'
            })

            .when('/materials', {
                templateUrl: 'materials/imgtxts/imgtxts.html',
                controller: 'ImgtxtsCtrl'
            })

            .when('/materials/images', {
                templateUrl: 'materials/imgs/imgs.html',
                controller: 'ImgsCtrl'
            })

        ;


    }])

    .controller('ImgsCtrl', ['$scope', '$http', 'Images', 'ngDialog', function($scope, $http, Images, ngDialog) {

        $scope.selectedTab = 'img';
        $scope.selectedImgs = [];

        $scope.itemsPerPage = 12;
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.delSelected = function(id) {
            if (id) {
                //传ID则只删一个
                $scope.selectedImgs = [];
                $scope.putIn(id);
            }

            if ($scope.selectedImgs.length) {
                ngDialog.openConfirm({
                    template: 'delTpl',
                    className: 'ngdialog-theme-plain',
                    controller: 'ImgsCtrl',
                    scope: $scope
                }).then(function(data) {

                    $http.post('/api/images_del', {ids: $scope.selectedImgs})
                        .then(function(res) {

                            $scope.search();

                        }, function() {

                        });

                }, function(reason){

                });
            }
        };

        $scope.toggleAll = function () {
            if ($scope.selectedImgs.length != $scope.imgs.length) {
                angular.forEach($scope.imgs, function(value, key) {
                    $scope.putIn(value.id);
                })
            } else {
                $scope.selectedImgs = [];
            }
        };

        $scope.inSelected = function(index) {
            return contain($scope.selectedImgs, index);
        };

        $scope.toggleSelect = function(index) {
            var i = find($scope.selectedImgs, index);
            if (i != -1) {
                $scope.selectedImgs.splice(i, 1);
            } else {
                $scope.selectedImgs.push(index);
            }
        };

        $scope.putIn = function(id) {
            if (!$scope.inSelected(id))
                $scope.selectedImgs.push(id);
        };

        var contain = function(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        var find = function(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return i;
                }
            }
            return -1;
        };

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.search();
        };

        $scope.getImages = function() {

            $http.get('/api/images/'+$scope.currentPage+'/'+$scope.itemsPerPage)
                .then(function(res){
                    $scope.imgs = res.data.data;
                    $scope.totalItems = res.data.total;
                }, function() {

                });
        };

        $scope.search = function() {

            $scope.selectedImgs = [];//reset chosen one

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
            $scope.search();
            //$scope.selectedImg = 0;//上传完后选中
            $scope.formData.chosen = $message.path;
        };

        $scope.search();
    }])

    .controller('ImgtxtsCtrl', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
        $scope.selectedTab = 'imgtxt';
        $scope.toBeDelete = undefined;

        $scope.itemsPerPage = 4;
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.search();
        };

        /**
         * 删除指定imgtxt
         * @param ids number or array of numbers
         */
        $scope.del = function(id) {
            //console.log(id);return;


            if (!id) return;

            ngDialog.openConfirm({
                template: 'delTpl',
                className: 'ngdialog-theme-plain',
                controller: 'ImgtxtsCtrl',
                scope: $scope
            }).then(function(data) {

                $http.post('/api/imgtxt_del', {id: id})
                    .then(function(res) {

                        $scope.search();

                    }, function() {

                    });

            }, function(reason){

            });


        };

        $scope.search = function() {

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

        //$scope.search = function() {
        //    //$scope.extraParams = undefined;
        //    $scope.doSearch();
        //};


        $scope.search();



    }])
    .controller('ImgtxtsAddCtrl', [
        '$scope', '$http', '$location',
        'flowFactory', '$alert', 'ngDialog',
        '$routeParams',
        function($scope, $http, $location, flowFactory, $alert, ngDialog, $routeParams) {

            $scope.formData = {
                title   : '',
                content : 'hello'
            };

            var editId = $routeParams.imgtxtId;//如果有editId,则初始化时的数据从后端读取，且提交表单时，比add时多一个editId

            if (editId) {
                //获取单个imgtxts
                $http.get('/api/imgtxt/'+editId)
                    .then(function(res){
                        $scope.imgtxt = res.data.data;

                        $scope.formData.title = $scope.imgtxt.title;
                        $scope.formData.content = $scope.imgtxt.content;
                        $scope.formData.thumb = $scope.imgtxt.pic_url;
                        $scope.formData.desc = $scope.imgtxt.description;
                        $scope.formData.author = $scope.imgtxt.author;

                    }, function() {

                    });
            }

            $scope.selectedTab = 'imgtxt';

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

            $scope.submitForm1 = function(valid) {
                $scope.submitting = true;//标记用户submit了
                $scope.unsubmitable = true;

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
                    $scope.unsubmitable = false;
                    return;
                }

                //if (!$scope.thumbFlow.files.length) {
                if (!$scope.formData.thumb) {
                    alertOpt.content = '封面未设置';
                    $alert(alertOpt);
                    $scope.unsubmitable = false;
                    return;
                }

                $scope.formData.id = editId ? editId : undefined;

                $http.post('/api/imgtxt_save',$scope.formData)
                    .success(function(res) {
                        $scope.unsubmitable = false;
                        $location.path('/materials')
                    });

            };


            //上传成功
            $scope.flowSuccess = function( $file, $message, $flow ) {
                console.log($message);
                $message = JSON.parse($message);
                if ($message['path']) {
                    $scope.formData.thumb = $message['path'];//@todo:cancel 时要把这设为空

                }
            };

            $scope.cancelChosen = function() {
                $scope.formData.thumb = undefined;
            }

            //从图库选取
            $scope.openTemplate = function () {

                var tplDialog = ngDialog.openConfirm({
                    template: '/gallery/gallery.html',
                    className: 'ngdialog-theme-plain custom-width-600',
                    controller: 'GalleryCtrl',
                    scope: $scope
                })
                    .then(function(data) {
                        if (!data) {
                            //请选择一张图片
                        }

                        //console.log(data);
                        $scope.formData.thumb = data.imgurl;

                        //成功选取
                        //ngDialog.open({
                        //    template: '<p>choen</p>'+'<img src="'+data.imgurl+'" style="width:100%"/>',
                        //    className: 'ngdialog-theme-plain',
                        //    plain: true
                        //
                        //});

                    },
                    function(reason) {
                        console.log('r:', reason);
                    }
                );

            };



        }]);//ImgtxtsAddCtrl end


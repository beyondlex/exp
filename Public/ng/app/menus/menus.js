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

    .controller('MenusCtrl', ['$scope', 'editableOptions',
        'editableThemes', 'ngDialog',
        function($scope, editableOptions, editableThemes, ngDialog) {

            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';

            $scope.moveable = false;
            $scope.currentPanel = 'index';
            $scope.formData = [];

            $scope.resetPanel = function() {
                $scope.formData = [];
                $scope.currentPanel='index';
            };

            $scope.treeOptions = {
                //Check if the current dragging node can be dropped in the ui-tree-nodes.
                //Return If the nodes accept the current dragging node.
                accept: function(sourceNodeScope, destNodesScope, destIndex) {
                    if (!$scope.moveable) {
                        return false;
                    }
                    if (!destNodesScope.isParent(sourceNodeScope)) {
                        return false;//不能跨国拖动
                    }
                    return true;
                },
                //Check if the current selected node can be dragged.
                //Return If current node is draggable.
                beforeDrag: function (sourceNodeScope) {

                    return $scope.moveable;//这样可以阻止一点击就处于移动状态
                },
                //If a node moves it's position after dropped, the nodeDropped callback will be called.
                dropped: function(event) {
                    //event.dest.nodeScope.$modelValue.order_num = event.source.index;
                    console.log('event:', event);
                },
                //The dragStart function is called when the user starts to drag the node. Parameters: Same as Parameters of dropped.
                dragStart: function(event) {

                    return true;
                },
                beforeDrop: function(event) {

                }
            };

            $scope.remove = function (scope) {
                scope.remove();
            };

            $scope.toggle = function (scope) {
                scope.toggle();
            };

            $scope.moveLastToTheBeginning = function () {
                var a = $scope.data.pop();
                $scope.data.splice(0, 0, a);
            };

            $scope.newSubItem = function (scope) {
                if (scope.depth() >= 2) {//如果自定义了accept方法，则需要在新建节点时自行判断节点深度
                    //alert
                    return;
                }

                var nodeData = scope.$modelValue;
                if (nodeData.nodes.length>=5) {
                    return;
                }
                nodeData.nodes.push({
                    id: nodeData.id * 10 + nodeData.nodes.length + 1,
                    //title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                    title: '重命名',
                    nodes: []
                });
            };

            $scope.menuSelect = function(scope) {
                $scope.resetPanel();

                $scope.selectedMenu = scope.$modelValue;
                $scope.currentScope = scope;

                var currentDepth = scope.depth();

                $scope.rootSelected = currentDepth == 1;

                if (currentDepth >= 2) {
                    $scope.subable = false; //是否显示右侧的创建二级菜按钮
                }
                else $scope.subable = scope.childNodesCount() < 5;
            };

            $scope.canCreateSub = function() {
                return $scope.subable;
            };

            $scope.ifRootSelected = function() {
                return $scope.rootSelected;
            };

            $scope.currentChildCount = function() {
                if (!$scope.currentScope) return 0;
                return $scope.currentScope.childNodesCount();
            };


            $scope.isSelectedMenu = function(id) {
                if (!$scope.selectedMenu) return false;

                return $scope.selectedMenu.id == id;
            };

            $scope.showMaterialsPanel = function() {
                $scope.currentPanel = 'materials';
            }

            $scope.addRootNode = function() {
                var nodeData = $scope.data;
                if (nodeData.length>=3) {
                    return;
                }
                nodeData.push({
                    id: nodeData.length + 1,
                    //title: 'node'+ (nodeData.length + 1),
                    title: '重命名',
                    nodes: []
                });

            }

            $scope.sort = function() {
                if (!$scope.moveable) {
                    //@todo
                    console.log('post sort');
                }
            }

            $scope.collapseAll = function () {
                $scope.$broadcast('collapseAll');
            };

            $scope.expandAll = function () {
                $scope.$broadcast('expandAll');
            };

            //从图库选取
            $scope.openImgLib = function () {

                var tplDialog = ngDialog.openConfirm({
                    template: '/gallery/gallery.html',
                    className: 'ngdialog-theme-plain ',
                    controller: 'GalleryCtrl',
                    scope: $scope
                })
                    .then(function(data) {
                        if (!data) {
                            //请选择一张图片
                        }

                        //console.log(data);
                        $scope.formData.img = data.imgurl;
                        console.log($scope.formData.img);

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

            //从图文消息库中选取
            $scope.openNewsLib = function () {

                var tplDialog = ngDialog.openConfirm({
                    template: '/materials/news/news.html',
                    className: 'ngdialog-theme-plain custom-width-600',
                    controller: 'NewsCtrl',
                    scope: $scope
                })
                    .then(function(data) {
                        if (!data) {
                            //请选择一张图片
                        }

                        //console.log(data);
                        $scope.formData.news = data;
                        //console.log($scope.formData.img);

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

            $scope.data = [{
                'id': 1,
                'title': 'node1',
                'nodes': [
                    {
                        'id': 11,
                        'title': 'node1.1',
                        'nodes': []
                    },
                    {
                        'id': 12,
                        'title': 'node1.2',
                        'nodes': []
                    }
                ]
            }, {
                'id': 2,
                'title': 'node2',
                'nodes': [
                    {
                        'id': 21,
                        'title': 'node2.1',
                        'nodes': []
                    },
                    {
                        'id': 22,
                        'title': 'node2.2',
                        'nodes': []
                    }
                ]
            }];

    }]);
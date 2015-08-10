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

    .controller('MenusCtrl', ['$scope', '$http', 'editableOptions',
        'editableThemes', 'ngDialog', '$alert',
        function($scope, $http, editableOptions, editableThemes, ngDialog, $alert) {

            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';

            $scope.moveable = false;
            $scope.currentPanel = 'index';
            $scope.formData = [];
            $scope.data = [];
            $scope.nodeTimes = 0;

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

            $scope.removeMenu = function (scope) {
                //@todo: confirm
                ngDialog.openConfirm({
                    template: 'delTpl',
                    className: 'ngdialog-theme-plain ',
                    controller: 'MenusCtrl',
                    scope: $scope
                })
                    .then(function(data) {

                        $scope.delMenu(scope.$modelValue.id);
                        //console.log(scope);
                        //scope.remove();
                    },
                    function(reason) {
                        console.log('r:', reason);
                    }
                );
                //
            };

            $scope.delMenu = function(id) {
                $http.post('/api/delMenu', {id: id})
                    .then(function(data) {
                        $scope.getMenus();
                        $scope.tips('菜单已删除', 'info');
                    }, function(data) {

                    })
            }

            $scope.toggle = function (scope) {
                scope.toggle();
            };

            $scope.moveLastToTheBeginning = function () {
                var a = $scope.data.pop();
                $scope.data.splice(0, 0, a);
            };

            $scope.tips = function(msg, type) {
                var alertOpt = {
                    content: msg,
                    container: 'body',
                    placement: 'top-right',
                    duration: 3,
                    type: type ? type : 'danger',//success info warning danger
                    show: true
                };
                $alert(alertOpt);
            };

            $scope.addRootNode = function() {
                var nodeData = $scope.data;
                if (nodeData.length>=3) {

                    $scope.tips('你已创建3个一级菜单。');

                    return;
                }

                //console.log(new Date().getTime());

                nodeData.push({
                    id: $scope.randomString(32),
                    //title: 'node'+ (nodeData.length + 1),
                    title: '',
                    nodes: [],
                    order_num: nodeData.length + 1,
                    isNew: 'just for frontend'
                });

            }

            $scope.newSubItem = function (scope) {
                if (scope.depth() >= 2) {//如果自定义了accept方法，则需要在新建节点时自行判断节点深度
                    //alert
                    return;
                }

                var nodeData = scope.$modelValue;
                if (nodeData.nodes.length>=5) {
                    $scope.tips('只能创建5个二级菜单');
                    return;
                }
                nodeData.nodes.push({
                    //id: nodeData.id * 10 + nodeData.nodes.length + 1,
                    id: $scope.randomString(32),
                    //title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                    title: '',
                    nodes: [],
                    order_num: nodeData.nodes.length + 1,
                    isNew: 'just for frontend'
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

            $scope.getMenus = function() {
                $http.get('/api/Menus').then(function(res) {
                    $scope.data = res.data;

                    //console.log($scope.data);

                }, function(data) {

                });
            };

            //add or update
            $scope.updateMenu = function (scope) {
                var node = scope.$parent.$parent;
                var nodeValue = node.$modelValue;
                if (node.$parentNodeScope) {
                    nodeValue.parent_id = node.$parentNodeScope.$modelValue.id;
                }

                $http.post('/api/menuSave',{data: nodeValue})
                    .success(function(res) {
                        //console.log(res);
                        $scope.getMenus();//refresh menu
                    });


                //to db

                /*
                 id         "shyybobs9b8comio0aftuhc7mel4llle"  如果数据库有则更新，没有则添加
                 nodes      []
                 parentId   "ew1j9lwphq7x4osyxdul2zv9e81331mx"
                 title      "2"
                 */
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
            };

            $scope.flowSuccess = function($file, $message, $flow ) {
               var msg = angular.fromJson($message);

                if (msg.path)
                    $scope.formData.img = msg.path;
            };


            $scope.sort = function() {
                if (!$scope.moveable) {
                    //@todo
                    console.log($scope.data);
                    //return;
                    $http.post('api/sortMenu', {data: $scope.data}).then(
                        function(data) {
                            $scope.getMenus();
                            console.log(data);
                        },
                        function(data) {

                        }
                    )
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

            $scope.randomString = function(length) {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                for(var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            };



            $scope.getMenus();


            //$scope.data = [{
            //    'id': 1,
            //    'title': 'node1',
            //    'nodes': [
            //        {
            //            'id': 11,
            //            'title': 'node1.1',
            //            'nodes': []
            //        },
            //        {
            //            'id': 12,
            //            'title': 'node1.2',
            //            'nodes': []
            //        }
            //    ]
            //}, {
            //    'id': 2,
            //    'title': 'node2',
            //    'nodes': [
            //        {
            //            'id': 21,
            //            'title': 'node2.1',
            //            'nodes': []
            //        },
            //        {
            //            'id': 22,
            //            'title': 'node2.2',
            //            'nodes': []
            //        }
            //    ]
            //}];

    }]);
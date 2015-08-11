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

            $scope.moveable = false;//排序开关
            $scope.currentPanel = 'index';
            $scope.formData = {};//页面右侧将要提交的数据
            $scope.data = [];//菜单节点数据

            //重置右侧面板
            $scope.resetPanel = function() {
                $scope.formData = [];
                $scope.currentPanel='index';
            };

            //左侧树配置
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

            //创建一级菜单
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

            //创建子菜单
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

            //点击选中某菜单
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

            //前端删除某个菜单
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

            //提示
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


            //是否可以创建子菜单
            $scope.canCreateSub = function() {
                return $scope.subable;
            };

            //当前选中的是否一级菜单
            $scope.ifRootSelected = function() {
                return $scope.rootSelected;
            };

            //当前选中的菜单的子菜单数
            $scope.currentChildCount = function() {
                if (!$scope.currentScope) return 0;
                return $scope.currentScope.childNodesCount();
            };

            //所传入的ID是否当前选中的菜单的id
            $scope.isSelectedMenu = function(id) {
                if (!$scope.selectedMenu) return false;

                return $scope.selectedMenu.id == id;
            };

            //右侧显示素材选择页
            $scope.showMaterialsPanel = function() {
                $scope.currentPanel = 'materials';
            };

            $scope.collapseAll = function () {
                $scope.$broadcast('collapseAll');
            };

            $scope.expandAll = function () {
                $scope.$broadcast('expandAll');
            };

            //折叠
            $scope.toggle = function (scope) {
                scope.toggle();
            };

            $scope.moveLastToTheBeginning = function () {
                var a = $scope.data.pop();
                $scope.data.splice(0, 0, a);
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
                        $scope.formData = {};
                        $scope.formData.img = data.imgurl;
                        $scope.formData.type = 'click';
                        $scope.formData.material = data.id;

                    },
                    function(reason) {
                        //console.log('r:', reason);
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
                        $scope.formData = {};
                        $scope.formData.news = data;
                        $scope.formData.type = 'click';
                        $scope.formData.material = data.id;

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

            //CURD-------------------------------------------------------------------
            $scope.publish = function() {

                if (!$scope.selectedMenu) {
                    $scope.tips('未选择菜单');
                    return;
                }
                console.log($scope.formData);
                if (_.isEmpty($scope.formData)) {
                    $scope.tips('请设置当前菜单内容');
                    return;
                }

                var data = {
                    id: $scope.selectedMenu.id,
                    type: $scope.formData.type,
                    material: $scope.formData.material
                };

                $http.post('/api/publishMenu', {data:data}).then(function(data) {
                    console.log(data);
                }, function(data) {

                });



            }

            //通知后台删除某个菜单
            $scope.delMenu = function(id) {
                $http.post('/api/delMenu', {id: id})
                    .then(function(data) {
                        $scope.getMenus();
                        $scope.tips('菜单已删除', 'info');
                    }, function(data) {

                    })
            }

            //获取后台菜单数据
            $scope.getMenus = function() {
                $http.get('/api/Menus').then(function(res) {
                    $scope.data = res.data;

                    //console.log($scope.data);

                }, function(data) {

                });
            };

            //新增菜单或更新菜单名称
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

            //上传图片成功后
            $scope.flowSuccess = function($file, $message, $flow ) {
                var msg = angular.fromJson($message);

                if (msg.path) {
                    $scope.formData = {};
                    $scope.formData.img = msg.path;
                    $scope.formData.type = 'click';
                    $scope.formData.material = msg.id;
                    console.log($scope.formData);
                }

            };

            //菜单确定排序
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
            //CURD-------------------------------------------------------------------

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
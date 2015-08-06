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

    .controller('MenusCtrl', ['$scope', 'editableOptions', 'editableThemes', function($scope, editableOptions, editableThemes) {

        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';

        $scope.moveable = false;

        // Switches
        if ($('[data-toggle="switch"]').length) {
            $('[data-toggle="switch"]').bootstrapSwitch();
        }

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
                id: nodeData.id * 10 + nodeData.nodes.length,
                //title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                title: '重命名',
                nodes: []
            });
        };

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
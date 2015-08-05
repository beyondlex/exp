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

    .controller('MenusCtrl', ['$scope', function($scope) {

        $scope.moveable = true;

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
                return true;
            },
            //If a node moves it's position after dropped, the nodeDropped callback will be called.
            dropped: function(event) {

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
            var nodeData = scope.$modelValue;
            if (nodeData.nodes.length>=5) {
                return;
            }
            nodeData.nodes.push({
                id: nodeData.id * 10 + nodeData.nodes.length,
                title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        };

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
        }, {
            'id': 3,
            'title': 'node3',
            'nodes': [
                {
                    'id': 31,
                    'title': 'node3.1',
                    'nodes': []
                }
            ]
        }];

    }]);
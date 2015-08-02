'use strict';
/* Services */
angular.module('myApp.services', ['ngResource'])
    .factory('Images', ['$resource', '$http',
        function($resource, $http){
            return {

                getImages: function(_page, _perPage, _params) {
                    return $http.get('/api/images/'+_page+'/'+_perPage, {
                        //params:{
                        //    page:_page,
                        //    perPage:_perPage,
                        //    params:_params
                        //},
                        withCredentials: true
                    });
                }

            };

        }]);
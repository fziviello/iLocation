(function(){
    'use strict';

    angular.module('iLocation')
        .factory('HomeService', HomeService);

        HomeService.$inject=['$resource','$rootScope'];

        function HomeService($resource,$rootScope){
           
            var ListaUtentiConnessi = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userConnected', null, {'listConnected': {'method': 'GET'}})
           
            return {
                listaUtentiConnessi: listaUtentiConnessi
            }

            function listaUtentiConnessi(callback){
                callback = callback || angular.noop;
                return ListaUtentiConnessi.listConnected(function(data){
                    return callback(data);
                }).$promise;
                
            }
        }
        
})();
(function(){
    'use strict';

    angular.module('iLocation')
        .factory('RuoloService', RuoloService);

        RuoloService.$inject=['$resource','$rootScope'];

        function RuoloService($resource,$rootScope){
           
            var ListaRuolo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/ruolo/list', null, {'list': {'method': 'GET'}})
            var Ruolo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/ruolo/search/:id', null, {'get': {'method': 'GET'}})
            var AddRuolo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/ruolo/add', null, {'add': {'method': 'POST'}})
            var UpdateRuolo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/ruolo/update', null, {'update': {'method': 'POST'}})


            return {
                lista: lista,
                ruolo:ruolo,
                addRuolo:addRuolo,
                updateRuolo:updateRuolo
            }

            function lista(ruolo, callback){
                callback = callback || angular.noop;
                return ListaRuolo.list(ruolo, function(data){
                    return callback(data);
                }).$promise;
                
            }

            function addRuolo(ruolo, callback){
                callback = callback || angular.noop;
                return AddRuolo.add(ruolo, function(data){
                    return callback(data);
                }).$promise;
                
            }

            function updateRuolo(ruolo, callback){
                callback = callback || angular.noop;
                return UpdateRuolo.update(ruolo, function(data){
                    return callback(data);
                }).$promise;
                
            }

            function ruolo(ruolo, callback){
                callback = callback || angular.noop;
                
                return Ruolo.get(ruolo, function(data){
                    return callback(data);
                }).$promise;
                
            }
        }
})();
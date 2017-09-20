(function(){
    'use strict';

    angular.module('iLocation')
        .factory('UserService', UserService);

        UserService.$inject=['$resource','$rootScope'];

        function UserService($resource,$rootScope){
           
            var ProfiloFull = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userFull/:id', null, {'get': {'method': 'GET'}})
            var Profilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/:id', null, {'get': {'method': 'GET'}})
            var UpdateProfilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userUpdate', null, {'update': {'method': 'POST'}})

            return {
                getProfile: getProfile,
                getProfileFull: getProfileFull,
                updateProfile: updateProfile
            }

            function getProfile(user,callback){
                callback = callback || angular.noop;
                return Profilo.get(user,function(data){
                    return callback(data);
                }).$promise;
            }

            function getProfileFull(user,callback){
                callback = callback || angular.noop;
                return ProfiloFull.get(user,function(data){
                    return callback(data);
                }).$promise;
            }

            function updateProfile(user,callback){
                callback = callback || angular.noop;
                return UpdateProfilo.update(user,function(data){
                    return callback(data);
                }).$promise;
                
            }
        }
        
})();
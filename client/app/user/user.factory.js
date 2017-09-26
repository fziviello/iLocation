(function(){
    'use strict';

    angular.module('iLocation')
        .factory('UserService', UserService);

        UserService.$inject=['$resource','$rootScope'];

        function UserService($resource,$rootScope){
           
            var ProfiloLogged = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userProfile', null, {'post': {'method': 'POST'}})
            var ProfiloFull = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userProfileFull', null, {'post': {'method': 'POST'}})
            var Profilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/:id', null, {'get': {'method': 'GET'}})
            var UpdateProfilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userUpdate', null, {'update': {'method': 'POST'}})

            return {
                getProfile: getProfile,
                getProfileLogged: getProfileLogged,
                ProfiloFull: ProfiloFull,
                updateProfile: updateProfile
            }

            function getProfile(user,callback){
                callback = callback || angular.noop;
                return Profilo.get(user,function(data){
                    return callback(data);
                }).$promise;
            }

            function getProfiloFull(user,callback){
                callback = callback || angular.noop;
                return ProfiloFull.post(user,function(data){
                    return callback(data);
                }).$promise;
            }

            function getProfileLogged(user,callback){
                callback = callback || angular.noop;
                return ProfiloLogged.post(user,function(data){
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
(function(){
    'use strict';

    angular.module('iLocation')
        .factory('UserService', UserService);

        UserService.$inject=['$resource','$rootScope'];

        function UserService($resource,$rootScope){
           
            var Profilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/:id', null, {'get': {'method': 'GET'}})
            var UpdateProfilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/userUpdate', null, {'update': {'method': 'POST'}})

            return {
                getProfile: getProfile,
                updateProfile: updateProfile
            }

            function getProfile(user,callback){
                callback = callback || angular.noop;
                return Profilo.get(user,function(data){
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
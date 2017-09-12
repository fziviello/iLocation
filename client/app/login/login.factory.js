(function(){
    'use strict';

    angular.module('iLocation')
        .factory('LoginService', LoginService);

        LoginService.$inject=['$resource','$rootScope'];

        function LoginService($resource,$rootScope){
           
            var Login = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/login:data', null, {'connect': {'method': 'POST'}})
            var Logout = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/logout:data', null, {'disconnect': {'method': 'POST'}})
           
            return {
                login: login,
                logout:logout
            }

            function login(user, callback){
                callback = callback || angular.noop;
                
                return Login.connect(user, function(data){
                    return callback(data);
                }).$promise;
                
            }
            
            function logout(user, callback){
                callback = callback || angular.noop;
                return Logout.disconnect(user, function(data){
                    return callback(data);
                }).$promise;
                
            }
        }
        
})();
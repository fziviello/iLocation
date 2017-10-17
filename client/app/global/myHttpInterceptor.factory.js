(function() {
    'use strict';

    angular
        .module('iLocation')
        .factory('myHttpInterceptor', myHttpInterceptor);

    myHttpInterceptor.$inject = ['$sessionStorage', '$location'];

    function myHttpInterceptor($sessionStorage, $location) {
        var service = {
            request: request
        }

        return service;

        function request(config) {
          if ( $sessionStorage.token ) {
            if(config.headers.Authorization) {
                return config
            }            
                config.headers.Authorization = 'Bearer ' + atob($sessionStorage.token);
          } else {
            $location.path('/login')
          }
          return config;
        }
    }
})();

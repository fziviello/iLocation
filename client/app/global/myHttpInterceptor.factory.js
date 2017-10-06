(function() {
    'use strict';

    angular
        .module('iLocation')
        .factory('myHttpInterceptor', myHttpInterceptor);

    myHttpInterceptor.$inject = ['$localStorage', '$location'];

    function myHttpInterceptor($localStorage, $location) {
        var service = {
            request: request
        }

        return service;

        function request(config) {
          if ( $localStorage.token ) {
            if(config.headers.Authorization) {
                return config
            }            
                config.headers.Authorization = 'Bearer ' + $localStorage.token;
          } else {
            $location.path('/login')
          }
          return config;
        }
    }
})();

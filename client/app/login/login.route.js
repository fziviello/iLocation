(function(){

    'use strict';

    angular.module('iLocation.Login').config(config);

    function config($routeProvider){
        $routeProvider
        .when('/login', {
            templateUrl:'/view/login/template/login.html',
            controller:'LoginController',
            controllerAs:'vm'
        })
        .when('/logout', {
            templateUrl:'/view/login/template/logout.html',
            controller:'LoginController',
            controllerAs:'vm'
        })
        .otherwise({
            redirectTo: '/login'
          })
    }
    
})();
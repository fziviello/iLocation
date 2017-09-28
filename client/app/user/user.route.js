(function(){
    
        'use strict';
    
        angular.module('iLocation.User').config(config);
    
        function config($routeProvider){
            $routeProvider
            .when('/user/profile', {
                templateUrl:'/view/user/template/profile.html',
                controller:'UserController',
                controllerAs:'vm'
            })
            .when('/user/list', {
                templateUrl:'/view/user/template/utenti.html',
                controller:'UserController',
                controllerAs:'vm'
            })
            .when('/user/add', {
                templateUrl:'/view/user/template/inserisci.html',
                controller:'UserController',
                controllerAs:'vm'
            })
            .when('/user/edit/:id', {
                templateUrl:'/view/user/template/gestisci.html',
                controller:'UserController',
                controllerAs:'vm'
            })
          
        }
})();
(function(){
    
        'use strict';
    
        angular.module('iLocation.Home').config(config);
    
        function config($routeProvider){
            $routeProvider
            .when('/home', {
                templateUrl:'/view/home/template/home.html',
                controller:'HomeController',
                controllerAs:'vm'
            })
        }
    })();
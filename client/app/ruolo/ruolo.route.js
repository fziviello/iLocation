(function(){
    
        'use strict';
    
        angular.module('iLocation.Ruolo').config(config);
    
        function config($routeProvider){
            $routeProvider
            .when('/ruolo', {
                templateUrl:'/view/ruolo/template/ruolo.html',
                controller:'RuoloController',
                controllerAs:'vm'
            })
            .when('/ruolo/gestisci/:id', {
                templateUrl:'/view/ruolo/template/gestisci.html',
                controller:'RuoloController',
                controllerAs:'vm'
            })
            .when('/ruolo/add', {
                templateUrl:'/view/ruolo/template/inserisci.html',
                controller:'RuoloController',
                controllerAs:'vm'
            })
        }    
    })();
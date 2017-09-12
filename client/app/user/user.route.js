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
          
        }
})();
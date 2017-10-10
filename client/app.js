(function(){

'use strict';
angular.module("iLocation", ['ngRoute', 'ngResource', 'ngStorage','toaster','ngAnimate','ui.bootstrap','ngDialog','underscore','iLocation.Login','iLocation.Home','iLocation.User','iLocation.Ruolo','btford.socket-io'])
    .config(config)
    .run(run);
    
    function config($routeProvider, $locationProvider,$httpProvider){
        $httpProvider.interceptors.push('myHttpInterceptor');
        $locationProvider.hashPrefix('');        
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    function run($rootScope,$location,$localStorage){

        $rootScope.URL = 'https://192.168.1.24:';
        $rootScope.PORT = '3000';
        $rootScope.API = '/api/v1';
        $rootScope.UserLogged='';
        // $rootScope.UserLoggedImg='';
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if(!$localStorage.token) {
                $location.path('/login');
            }
            else
            {
                $rootScope.UserLogged=atob($localStorage.nome);
                
                if(!!!$rootScope.UserLoggedImg)
                {
                    $rootScope.UserLoggedImg=(atob($localStorage.photo));        
                }
                else
                {
                    $rootScope.UserLoggedImg=(atob($localStorage.photo));                    
                }
            }
        });
        $rootScope.showLogged= function(){
            if(!$localStorage.token) 
            {
                return false;
            }
            else
            {
                return true;
            }
        };
        $rootScope.showRole= function(){
            if((atob($localStorage.id_ruolo))==1) //admin
            {
                return true;
            }
            else
            {
                return false;
            }
        };
    }
})();
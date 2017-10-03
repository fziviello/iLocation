(function(){

'use strict';
angular.module("iLocation", ['ngRoute', 'ngResource', 'ngStorage','toaster','ngAnimate','ui.bootstrap','ngDialog','underscore','iLocation.Login','iLocation.Home','iLocation.User','iLocation.Ruolo','btford.socket-io'])
    .factory('socket', function (socketFactory) {
        var myIoSocket = io.connect("https://192.168.1.24:4200",{secure: true}); // da sistemare
        var socket = socketFactory({
            ioSocket: myIoSocket
        });

        return socket;
    })
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
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if(!$localStorage.token) {
                $location.path('/login');
            }
            else
            {
                $rootScope.UserLogged=$localStorage.nome;
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
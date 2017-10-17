(function(){

'use strict';
angular.module("iLocation", ['ngRoute', 'ngResource', 'ngStorage','toaster','ngAnimate','ui.bootstrap','ngDialog','ngLoadingSpinner','underscore','iLocation.Login','iLocation.Home','iLocation.User','iLocation.Ruolo','btford.socket-io'])
    .config(config)
    .run(run);
    
    function config($routeProvider, $locationProvider,$httpProvider){
        $httpProvider.interceptors.push('myHttpInterceptor');
        $locationProvider.hashPrefix('');        
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    function run($rootScope,$location,$localStorage,$sessionStorage){

        $rootScope.URL = 'https://192.168.1.24:';
        $rootScope.PORT = '3000';
        $rootScope.URL_SOCKET = 'https://192.168.1.24:';
        $rootScope.PORT_SOCKET = '4200';
        $rootScope.API = '/api/v1';
        $rootScope.UserLogged='';
        
        $rootScope.$on('$routeChangeStart', function (event, next, current) {

            try{
                
                    if(!$sessionStorage.token) {
                        $location.path('/login');
                    }
                    else
                    {
                        $rootScope.UserLogged=atob($sessionStorage.nome);
                        
                        if(!!!$rootScope.UserLoggedImg)
                        {
                            $rootScope.UserLoggedImg=(atob($sessionStorage.photo));        
                        }
                        else
                        {
                            $rootScope.UserLoggedImg=(atob($sessionStorage.photo));                    
                        }
                    }
                    
            }

            catch(err)
            {
                $sessionStorage.$reset();
                $localStorage.$reset();
                $location.path('/login');
            }
        });
        $rootScope.showLogged= function(){

            try{
                
                if(!$sessionStorage.token) 
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch(err)
            {
                $sessionStorage.$reset();
                $localStorage.$reset();
                $location.path('/login');
            }
        };
        
        $rootScope.showRole= function(){
            try{
                
                if((atob($sessionStorage.id_ruolo))==1) //admin
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(err)
            {
                $sessionStorage.$reset();
                $localStorage.$reset();
                $location.path('/login');
            }
        };
    }
})();
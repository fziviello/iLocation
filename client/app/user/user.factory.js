(function(){
    'use strict';

    angular.module('iLocation')
        .factory('UserService', UserService);

        UserService.$inject=['$resource','$rootScope'];

        function UserService($resource,$rootScope){
            
            
            var AddUser = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/add', null, {'add': {'method': 'POST'}})
            var UpdateUser = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/update', null, {'update': {'method': 'POST'}})            
            var GetProfilo = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/search/:id', null, {'search': {'method': 'GET'}})
            var GetProfiloLogged = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/profile', null, {'profile': {'method': 'POST'}})
            var GetListaUser = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/list', null, {'list': {'method': 'GET'}})           
            var GetListaUserFull = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/listFull', null, {'listFull': {'method': 'POST'}})
            var GetUtentiConnessi = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/connected', null, {'connected': {'method': 'GET'}})
            var SetUserPwd = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/update/pwd', null, {'pwd': {'method': 'POST'}})
            var SetUserProfilePwd = $resource($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/update/profile/pwd', null, {'pwd': {'method': 'POST'}})

            return {
                addUser: addUser,
                updateUser: updateUser,
                getProfile: getProfile,
                getProfileLogged: getProfileLogged,
                getlistaUser:getlistaUser,                
                getlistaUserFull:getlistaUserFull,
                getUtentiConnessi: getUtentiConnessi,
                setUserPwd: setUserPwd,
                setUserProfilePwd:setUserProfilePwd
            }

            //INSERISCI UTENTE
            function addUser (user,callback){
                callback = callback || angular.noop;
                return AddUser.add(user,function(data){
                    return callback(data);
                }).$promise;
            }

            //AGGIORNA UTENTE
            function updateUser(user,callback){
                callback = callback || angular.noop;
                return UpdateUser.update(user,function(data){
                    return callback(data);
                }).$promise;
            }

            //PROFILO UTENTE LIMITATO
            function getProfile(user,callback){
                callback = callback || angular.noop;
                return GetProfilo.search(user,function(data){
                    return callback(data);
                }).$promise;
            }

            //PROFILO UTENTE FULL LOGGATO
            function getProfileLogged(user,callback){
                callback = callback || angular.noop;
                return GetProfiloLogged.profile(user,function(data){
                    return callback(data);
                }).$promise;
            }

             // LISTA UTENTI ATTIVI LIMITATA
             function getlistaUser(user, callback){
                callback = callback || angular.noop;
                return GetListaUser.list(user, function(data){
                    return callback(data);
                }).$promise;
            }

            // LISTA UTENTI FULL
            function getlistaUserFull(user, callback){
                callback = callback || angular.noop;
                return GetListaUserFull.listFull(user, function(data){
                    return callback(data);
                }).$promise;
            }

            //LISTA UTENTI CONNESSI LIMITATA 
            function getUtentiConnessi(callback){
                callback = callback || angular.noop;
                return GetUtentiConnessi.connected(function(data){
                    return callback(data);
                }).$promise;
            }

             //AGGIORNA PASSWORD UTENTE SELEZIONATO
             function setUserPwd(user,callback){
                callback = callback || angular.noop;
                return SetUserPwd.pwd(user,function(data){
                    return callback(data);
                }).$promise;
            }

            //AGGIORNA PASSWORD UTENTE LOGGATO
            function setUserProfilePwd(user,callback){
                callback = callback || angular.noop;
                return SetUserProfilePwd.pwd(user,function(data){
                    return callback(data);
                }).$promise;
            }

        }
        
})();
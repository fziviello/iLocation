(function(){
    'use strict';

    angular.module('iLocation')
        .controller('UserController', UserController);

        UserController.$inject=['UserService','$localStorage','$location','toaster'];

        function UserController(UserService,$localStorage,$location,toaster){
            var vm = this;
            var profilo=null;
            
            let objSend={
                'id':$localStorage.id
            };

            vm.LoadProfile= function(){
            
                return UserService.getProfile(objSend).then(function(data){
                                                        
                if(data.success===true)
                {
                    return vm.user=data.result[0];
                }
                    
                }).catch(function(err){
                    
                    toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: err
                    });

                });

            }

            vm.UpdateProfile= function(){
                let objSend={
                    'user':vm.user
                };

                $localStorage.nome=vm.user.nome;
                $localStorage.cognome=vm.user.cognome;
                $localStorage.email=vm.user.email;
                $localStorage.room=vm.user.room;
                $localStorage.colorMarker=vm.user.colorMarker;

                return UserService.updateProfile(objSend).then(function(data){
                    
                    if(data.success===true)
                    {
                        toaster.pop({
                            type: 'success',
                            title: 'Profilo',
                            body: 'Profilo Aggiornato'
                        });
                    }

                    return $location.path('/user/profile');
                }).catch(function(err){
                    toaster.pop({
                        type: 'error',
                        title: 'Profilo',
                        body: error
                    });

                    return err;
                });
                   
    
            }
        }

})();
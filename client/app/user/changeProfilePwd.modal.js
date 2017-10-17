(function(){
    'use strict';

    angular.module('iLocation')
        .controller('ChangeProfilePwdModalController', ChangeProfilePwdModalController);

        ChangeProfilePwdModalController.$inject=['UserService','$localStorage','$sessionStorage','toaster','ngDialog'];

        function ChangeProfilePwdModalController(UserService,$localStorage,$sessionStorage,toaster,ngDialog){

            var vm = this;

            //AGGIORNA PASSWORD UTENTE LOGGATO
            vm.ChangeProfilePwdDialog= function(){
                
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSendPwd={
                            'user':{
                                'id':atob($sessionStorage.id),
                                'token':atob($sessionStorage.token),
                                'id_change':atob($sessionStorage.id),
                                'password':vm.user.password
                            }
                        };

                        return UserService.setUserProfilePwd(objSendPwd).then(function(data){
                            if(data.success===true)
                            {
                               $sessionStorage.password= btoa(vm.user.password);
                                
                                toaster.pop({
                                    type: 'success',
                                    title: 'Utente',
                                    body: 'Password Aggiornata'
                                });

                                ngDialog.close();

                                return null;
                                
                            }
                            else
                            {
                                toaster.pop({
                                    type: 'warning',
                                    title: 'Utente',
                                    body: data.error.message
                                });
                            }                                
                        }).catch(function(err){
                            toaster.pop({
                                type: 'error',
                                title: 'Utente',
                                body: err
                            });
                        
                        });
                    }
                    else
                    {
                        toaster.pop({
                            type: 'error',
                            title: 'Errore Password',
                            body: 'Le password non corrispondono'
                        });

                    }
                
                toaster.pop({
                    type: 'error',
                    title: 'Errore',
                    body: 'Completa i campi obbligatori'
                });

                return null;
            }

        }
})();
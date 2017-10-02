(function(){
    'use strict';

    angular.module('iLocation')
        .controller('ChangeProfilePwdModalController', ChangeProfilePwdModalController);

        ChangeProfilePwdModalController.$inject=['UserService','$localStorage','toaster','ngDialog'];

        function ChangeProfilePwdModalController(UserService,$localStorage,toaster,ngDialog){

            var vm = this;

            //AGGIORNA PASSWORD UTENTE LOGGATO
            vm.ChangeProfilePwdDialog= function(){
                
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSendPwd={
                            'user':{
                                'id':$localStorage.id,
                                'token':$localStorage.token,
                                'id_change':$localStorage.id,
                                'password':vm.user.password
                            }
                        };

                        return UserService.setUserProfilePwd(objSendPwd).then(function(data){
                            if(data.success===true)
                            {

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
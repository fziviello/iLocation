(function(){
    'use strict';

    angular.module('iLocation')
        .controller('ChangePwdModalController', ChangePwdModalController);

        ChangePwdModalController.$inject=['dataChangePwd','UserService','$localStorage','$sessionStorage','toaster','ngDialog'];

        function ChangePwdModalController(dataChangePwd,UserService,$localStorage,$sessionStorage,toaster,ngDialog){

            var vm = this;

            if(!!!dataChangePwd || isNaN(dataChangePwd))
            {
                ngDialog.close();

                toaster.pop({
                    type: 'warning',
                    title: 'Utente',
                    body: 'Impossibile Aggiornare la password riprovare più tardi'
                });                
            }
            else
            {
                vm.id_change=dataChangePwd;
            }

            //AGGIORNA PASSWORD UTENTE SELEZIONATO
            vm.ChangePwdDialog= function(){
                
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSendPwd={
                            'user':{
                                'id':atob($sessionStorage.id),
                                'token':atob($sessionStorage.token),
                                'id_change':vm.id_change,
                                'password':vm.user.password
                            }
                        };

                        return UserService.setUserPwd(objSendPwd).then(function(data){
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
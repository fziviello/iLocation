(function(){
    'use strict';

    angular.module('iLocation')
        .controller('UserController', UserController);

        UserController.$inject=['UserService','RuoloService','$localStorage','$location','toaster'];

        function UserController(UserService,RuoloService,$localStorage,$location,toaster){
            var vm = this;
            var profilo=null;
            
            let objSend={
                'user':{
                        'id':$localStorage.id,
                        'token':$localStorage.token
                }
            };

            vm.LoadProfile= function(){
            
                return UserService.getProfileLogged(objSend).then(function(data){
                                                        
                if(data.success===true)
                {
                    vm.user=data.result[0];
                    vm.user.passwordCheck=data.result[0].password;
                    vm.ListaStatus=[
                        {id:1, nome:'Attivo'},
                        {id:0, nome:'Disattivo'}
                      ];
                    vm.ListaRuoli();                    
                    return vm.user;
                }
                    
                }).catch(function(err){
                    
                    toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: err
                    });

                });
            }

            vm.ListaRuoli = function(){
                return RuoloService.lista().then(function(data){
                    
                    if(data.success===true)
                    {
                       vm.Ruoli=data.result;
                       return vm.Ruoli;
                    }
                    
                    return null;

                }).catch(function(err){
                    toaster.pop({
                        type: 'error',
                        title: 'Ruolo',
                        body: 'Impossibile Caricare La lista Dei Ruoli'
                    });
                    return err;
                });
            } 

            vm.UpdateProfile= function(){
                
                //VALIDATE CLASSICO
                if(vm.user.nome!="" || vm.user.cognome!="" || vm.user.email!="" || vm.user.room!="" || vm.user.id_ruolo!="" || vm.user.status!="" || vm.user.colorMarker!="" || vm.user.password!=""){
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSend={
                            'user':{
                                'id':$localStorage.id,
                                'nome':vm.user.nome,
                                'cognome':vm.user.cognome,
                                'email':vm.user.email,
                                'room':vm.user.room,
                                'colorMarker':vm.user.colorMarker,
                                'password':vm.user.password,
                                'status':vm.user.status
                            }
                        };

                        $localStorage.nome=vm.user.nome;
                        $localStorage.cognome=vm.user.cognome;
                        $localStorage.email=vm.user.email;
                        $localStorage.room=vm.user.room;
                        $localStorage.colorMarker=vm.user.colorMarker;
                        $localStorage.password=vm.user.password;
        
                        return UserService.updateProfile(objSend).then(function(data){
                            
                            if(data.success===true)
                            {
                                toaster.pop({
                                    type: 'success',
                                    title: 'Profilo',
                                    body: 'Profilo Aggiornato'
                                });
                            }
                            if(objSend.user.status==0) //account disattivato
                            {
                                return $location.path('/logout');     
                            }

                            return $location.path('/user/profile');                                
                            
                        }).catch(function(err){
                            toaster.pop({
                                type: 'error',
                                title: 'Profilo',
                                body: err
                            });
        
                            return err;
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
                }
                   
    
            }
        }

})();
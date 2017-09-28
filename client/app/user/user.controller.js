(function(){
    'use strict';

    angular.module('iLocation')
        .controller('UserController', UserController);

        UserController.$inject=['UserService','RuoloService','$localStorage','$location','$routeParams','toaster','ngDialog'];

        function UserController(UserService,RuoloService,$localStorage,$location,$routeParams,toaster,ngDialog){
            
            var vm = this;
            var profilo=null;

            vm.ListaStatus=[
                {id:1, nome:'Attivo'},
                {id:0, nome:'Disattivo'}
            ];

            //FILTRO PER ORDINAMENTO
            vm.OrdinaUtenti = function(colonna){
                vm.reverse = (vm.colonna === colonna) ? !vm.reverse : true;
                vm.colonna = colonna;
            }

            //CARICO IL PROFILO DELL UTENTE LOGGATO
            vm.LoadProfile= function(){
            
                let objSend={
                    'user':{
                            'id':$localStorage.id,
                            'token':$localStorage.token
                    }
                };

                return UserService.getProfileLogged(objSend).then(function(data){
                                                        
                if(data.success===true)
                {
                    vm.user=data.result[0];
                    vm.user.passwordCheck=data.result[0].password;
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

            //INSERISCI UTENTE
            vm.addNewUser= function(){
                
                if(vm.user.nome!="" || vm.user.cognome!="" || vm.user.email!="" || vm.user.room!="" || vm.user.id_ruolo!="" || vm.user.status!="" || vm.user.colorMarker!="" || vm.user.password!="")
                {
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSend={
                            'user':{
                                'nome':vm.user.nome,
                                'cognome':vm.user.cognome,
                                'email':vm.user.email,
                                'room':vm.user.room,
                                'id_ruolo':vm.user.id_ruolo,
                                'colorMarker':vm.user.colorMarker,
                                'password':vm.user.password,
                                'status':vm.user.status
                            }
                        };

                        return UserService.addUser(objSend).then(function(data){
                            
                                if(data.success===true)
                                {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Utente',
                                        body: 'Utente Creato con Successo'
                                    });

                                    return $location.path('/user/list');
                                    
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
                }

                toaster.pop({
                    type: 'error',
                    title: 'Errore',
                    body: 'Completa i campi obbligatori'
                });

                return null;
            }

            //AGGIORNA PASSWORD UTENTE SELEZIONATO
            vm.updatePwd= function(){
                
                if(vm.user.id!="" || vm.user.password!="")
                {
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSend={
                            'user':{
                                'id':$localStorage.id,
                                'token':$localStorage.token,
                                'id_change':vm.user.id,
                                'password':vm.user.password
                            }
                        };

                        return UserService.setUserPwd(objSend).then(function(data){
                            
                                if(data.success===true)
                                {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Utente',
                                        body: 'Password Aggiornata'
                                    });

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
                }

                toaster.pop({
                    type: 'error',
                    title: 'Errore',
                    body: 'Completa i campi obbligatori'
                });

                return null;
            }

            //LISTA DEI RUOLI
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

            //LISTA UTENTI FULL VISIBILE SOLO SE ADMIN
            vm.ListaUtentiFull = function(){
                
                let objSend={
                    'user':{
                            'id':$localStorage.id,
                            'token':$localStorage.token
                    }
                };
                
                return UserService.getlistaUserFull(objSend).then(function(data){
                    
                    if(data.success===true)
                    {
                        vm.user=data.result;

                        return vm.user;
                    }
                    else
                    {
                        toaster.pop({
                            type: 'error',
                            title: 'Utente',
                            body: data.error.message
                        });

                        return $location.path('/home');  
                    }
                    
                }).catch(function(err){
                    
                    toaster.pop({
                        type: 'error',
                        title: 'Utente',
                        body: 'Impossibile Caricare La Lista Degli Utenti'
                    });
                    return err;
                });
            }    

            //AGGIORNAMENTO DELL UTENTE LOGGATO
            vm.UpdateProfile= function(){
                
                if(vm.user.nome!="" || vm.user.cognome!="" || vm.user.email!="" || vm.user.room!="" || vm.user.id_ruolo!="" || vm.user.status!="" || vm.user.colorMarker!="" || vm.user.password!=""){
                    if(vm.user.passwordCheck==vm.user.password)
                    {
                        let objSend={
                            'user':{
                                'id':$localStorage.id,
                                'nome':vm.user.nome,
                                'cognome':vm.user.cognome,
                                'email':vm.user.email,
                                "id_ruolo":atob($localStorage.id_ruolo),
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
        
                        return UserService.updateUser(objSend).then(function(data){
                            
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

            //AGGIORNAMENTO DELL UTENTE DA UN ADMIN
            vm.UpdateUser= function(){
                    
                if(vm.user.nome!="" || vm.user.cognome!="" || vm.user.email!="" || vm.user.room!="" || vm.user.id_ruolo!="" || vm.user.status!="" || vm.user.colorMarker!="")
                {
                    let objSend={
                        'user':{
                            'id':$routeParams.id,
                            'nome':vm.user.nome,
                            'cognome':vm.user.cognome,
                            'email':vm.user.email,
                            'room':vm.user.room,
                            'id_ruolo':vm.user.id_ruolo,
                            'colorMarker':vm.user.colorMarker,
                            'status':vm.user.status
                        }
                    };
    
                    return UserService.updateUser(objSend).then(function(data){
                        
                        if(data.success===true)
                        {
                            toaster.pop({
                                type: 'success',
                                title: 'Utente',
                                body: 'Profilo dell\'utente Aggiornato'
                            });
                        }

                        return $location.path('/user/list');                                
                        
                    }).catch(function(err){
                        toaster.pop({
                            type: 'error',
                            title: 'Profilo',
                            body: err
                        });
    
                        return err;
                    });
                }
            }

            //CARICA UTENTE SELEZIONATO
            vm.LoadUtente= function(){

                let objSend={
                    'id':$routeParams.id
                };
            
                return UserService.getProfile(objSend).then(function(data){
                                    
                if(data.success===true)
                {
                    vm.user=data.result[0];                   
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
        }
})();
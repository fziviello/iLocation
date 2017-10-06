(function(){
    'use strict';

    angular.module('iLocation')
        .controller('UserController', UserController);

        UserController.$inject=['UserService','RuoloService','$localStorage','$location','$routeParams','toaster','ngDialog','BlobService','$http','$scope','$rootScope'];

        function UserController(UserService,RuoloService,$localStorage,$location,$routeParams,toaster,ngDialog,BlobService,$http,$scope,$rootScope){
            
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


            vm.OpenChangePwdDialog= function(){
                
                    ngDialog.open({
                        controller:'ChangePwdModalController',
                        controllerAs:'vm',
                        template:'/view/user/template/changePwd.modal.html',
                        appendClassName:'ngdialog-changePwd',
                        resolve: {
                            dataChangePwd: function() {
                                return vm.user.id;
                            }
                        }
                    });
            }

            vm.OpenChangeProfilePwdDialog= function(){
                
                    ngDialog.open({
                        controller:'ChangeProfilePwdModalController',
                        controllerAs:'vm',
                        template:'/view/user/template/changeProfilePwd.modal.html',
                        appendClassName:'ngdialog-changePwd'
                    });
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

                if(vm.user.nome!="" || vm.user.cognome!="" || vm.user.email!="" || vm.user.room!="" || vm.user.id_ruolo!="" || vm.user.status!="" || vm.user.colorMarker!="")
                {
                    
                    if(vm.user.filePhoto==undefined)
                    {
                        //AGGIORNAMENTO DEL PROFILO SENZA FOTO

                        let objSend={
                            'user':{
                                'id':$localStorage.id,
                                'nome':vm.user.nome,
                                'cognome':vm.user.cognome,
                                'email':vm.user.email,
                                "id_ruolo":atob($localStorage.id_ruolo),
                                'room':vm.user.room,
                                'colorMarker':vm.user.colorMarker,
                                'status':vm.user.status
                            }
                        };

                        $localStorage.nome=vm.user.nome;
                        $localStorage.cognome=vm.user.cognome;
                        $localStorage.email=vm.user.email;
                        $localStorage.room=vm.user.room;
                        $localStorage.photo=undefined;
                        $localStorage.colorMarker=vm.user.colorMarker;

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
                        //AGGIORNAMENTO DEL PROFILO CON FOTO

                        let extFile=$scope.file.name.substring($scope.file.name.lastIndexOf(".") + 1);

                        if(extFile=='jpeg' || extFile=='jpg'|| extFile=='png')
                        {
                            let objDataSend = new FormData();

                            objDataSend.append('File', vm.user.filePhoto);
                            objDataSend.append('ext', extFile);
                            objDataSend.append('id', $localStorage.id);
                            //invio al server la vecchia foto se esiste
                            if(vm.user.photo)
                            {
                                objDataSend.append('oldFile', vm.user.photo);
                            }
                            
                            let config = {headers : {'Content-Type': undefined }}

                            $http.post($rootScope.URL+ $rootScope.PORT+ $rootScope.API+'/user/update/profile/photo', objDataSend, config)
                            .then(
                                function(response){
                                
                                    let nomeFileSalvato=response.data.result;

                                    let objSend={
                                        'user':{
                                            'id':$localStorage.id,
                                            'nome':vm.user.nome,
                                            'cognome':vm.user.cognome,
                                            'email':vm.user.email,
                                            'photo':nomeFileSalvato,
                                            "id_ruolo":atob($localStorage.id_ruolo),
                                            'room':vm.user.room,
                                            'colorMarker':vm.user.colorMarker,
                                            'status':vm.user.status
                                        }
                                    };
            
                                    $localStorage.nome=vm.user.nome;
                                    $localStorage.cognome=vm.user.cognome;
                                    $localStorage.email=vm.user.email;
                                    $localStorage.room=vm.user.room;
                                    $localStorage.photo=btoa(nomeFileSalvato);
                                    $localStorage.colorMarker=vm.user.colorMarker;
            
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
                                }, 
                                function(response){
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Immagine',
                                        body: 'Impossibile Caricare la foto'
                                    });
                                }
                            );
                        }
                        else
                        {
                            toaster.pop({
                                type: 'error',
                                title: 'Immagine',
                                body: 'Formato immagine errato'
                            });
                        }
                    }
                }
                else
                {
                    toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: 'Completa i campi obbligatori'
                    });
    
                    return null;
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
                else
                {
                    toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: 'Completa i campi obbligatori'
                    });
    
                    return null;
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
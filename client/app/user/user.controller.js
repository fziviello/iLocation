(function(){
    'use strict';

    angular.module('iLocation')
        .controller('UserController', UserController);

        UserController.$inject=['UserService','RuoloService','$localStorage','$sessionStorage','$location','$routeParams','toaster','ngDialog','BlobService','$http','$scope','$rootScope','PagerService'];

        function UserController(UserService,RuoloService,$localStorage,$sessionStorage,$location,$routeParams,toaster,ngDialog,BlobService,$http,$scope,$rootScope,PagerService){
            
            var vm = this;
            var profilo=null;


            vm.pager = {};

            vm.setPage = function(page){
                if (page < 1 || page > vm.pager.totalPages) {return;}
                vm.pager = PagerService.GetPager(vm.user.length, page);
                vm.UtentiPaginati = vm.user.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
            }
            
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
                            'id':atob($sessionStorage.id),
                            'token':atob($sessionStorage.token)
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
                            'id':atob($sessionStorage.id),
                            'token':atob($sessionStorage.token)
                    }
                };
                
                return UserService.getlistaUserFull(objSend).then(function(data){
                    
                    if(data.success===true)
                    {
                        vm.user=data.result;
                        vm.setPage(1);
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
                    
                    if(vm.user.filePhoto==undefined || vm.user.filePhoto=="defaultProfileImg.jpg")
                    {
                        //AGGIORNAMENTO DEL PROFILO SENZA FOTO
                        let objSend={
                            'user':{
                                'id':atob($sessionStorage.id),
                                'nome':vm.user.nome,
                                'cognome':vm.user.cognome,
                                'email':vm.user.email,
                                "id_ruolo":atob($sessionStorage.id_ruolo),
                                'room':vm.user.room,
                                'colorMarker':vm.user.colorMarker,
                                'status':vm.user.status
                            }
                        };

                        $sessionStorage.nome=btoa(vm.user.nome);
                        $sessionStorage.cognome=btoa(vm.user.cognome);
                        $sessionStorage.email=btoa(vm.user.email);
                        $sessionStorage.room=btoa(vm.user.room);
                        $sessionStorage.photo=btoa(vm.user.photo);
                        $sessionStorage.colorMarker=btoa(vm.user.colorMarker);

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

                            return $location.path('/home');                                
                            
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
                            objDataSend.append('id', atob($sessionStorage.id));
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
                                            'id':atob($sessionStorage.id),
                                            'nome':vm.user.nome,
                                            'cognome':vm.user.cognome,
                                            'email':vm.user.email,
                                            'photo':nomeFileSalvato,
                                            "id_ruolo":atob($sessionStorage.id_ruolo),
                                            'room':vm.user.room,
                                            'colorMarker':vm.user.colorMarker,
                                            'status':vm.user.status
                                        }
                                    };
            
                                    $sessionStorage.nome=btoa(vm.user.nome);
                                    $sessionStorage.cognome=btoa(vm.user.cognome);
                                    $sessionStorage.email=btoa(vm.user.email);
                                    $sessionStorage.room=btoa(vm.user.room);
                                    $sessionStorage.photo=btoa(nomeFileSalvato);
                                    $sessionStorage.colorMarker=btoa(vm.user.colorMarker);
            
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
            
                                        return $location.path('/home');                                
                                        
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
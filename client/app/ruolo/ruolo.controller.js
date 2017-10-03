(function(){
    'use strict';

    angular.module('iLocation')
        .controller('RuoloController', RuoloController);

        RuoloController.$inject=['RuoloService','$localStorage','$rootScope','$location','$routeParams','toaster'];

        function RuoloController(RuoloService,$localStorage,$rootScope,$location,$routeParams,toaster){
            var vm = this;            
                //controllo del ruolo
                if(!$rootScope.showRole())
                {
                    return $location.path('/home');
                }

                vm.reverse =false;
                
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
                
                vm.OrdinaRuolo = function(colonna){
                    vm.reverse = (vm.colonna === colonna) ? !vm.reverse : true;
                    vm.colonna = colonna;
                }

                vm.GestioneRuolo =function(){
                
                    return null;
                }


                vm.LoadRuolo= function(){

                    let objSend={
                        'id':$routeParams.id
                    };
                    
                        return RuoloService.ruolo(objSend).then(function(data){
                                                                
                        if(data.success===true)
                        {
                            vm.ruolo=data.result[0];
                            return vm.ruolo;
                        }
                            
                        }).catch(function(err){
                            
                            toaster.pop({
                                type: 'error',
                                title: 'Errore',
                                body: err
                            });
        
                        });
                    }

                    vm.UpdateRuolo= function(){

                        if(vm.ruolo.nome!=""){

                                let objSend={
                                    'ruolo':{
                                        'id':$routeParams.id,
                                        'nome':vm.ruolo.nome,
                                        'descrizione':vm.ruolo.descrizione
                                    }
                                };

                                return RuoloService.updateRuolo(objSend).then(function(data){
                                    
                                    if(data.success===true)
                                    {
                                        toaster.pop({
                                            type: 'success',
                                            title: 'Ruolo',
                                            body: 'Ruolo Aggiornato'
                                        });
                                    }

                                    return $location.path('/ruolo/list');                                
                                    
                                }).catch(function(err){
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Ruolo',
                                        body: err
                                    });
                
                                    return err;
                                });
                        }
                        
                        toaster.pop({
                            type: 'error',
                            title: 'Errore',
                            body: 'Completa i campi obbligatori'
                        });

                        return null;
            
                    }


                    vm.addRuolo= function(){
                        
                        if(vm.ruolo.nome!=""){

                                let objSend={
                                    'ruolo':{
                                        'nome':vm.ruolo.nome,
                                        'descrizione':vm.ruolo.descrizione,
                                    }
                                };

                            return RuoloService.addRuolo(objSend).then(function(data){
                                
                                if(data.success===true)
                                {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Ruolo',
                                        body: 'Ruolo Inserito'
                                    });
                                }

                                return $location.path('/ruolo/list');                                
                                
                            }).catch(function(err){
                                toaster.pop({
                                    type: 'error',
                                    title: 'Ruolo',
                                    body: err
                                });
            
                                return err;
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
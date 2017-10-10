(function(){
    'use strict';

    angular.module('iLocation')
        .controller('LoginController', LoginController);

        LoginController.$inject=['LoginService','$localStorage','$location','toaster','socket'];

        function LoginController(LoginService,$localStorage,$location,toaster,socket){
            var vm = this;
            
                vm.loginStatus=function(){
                    if($localStorage.token) {
                        return $location.path('/home');
                    }
                }

                vm.login = function(){
                    let objSend={
                        'login':vm.user
                    };
                    return LoginService.login(objSend).then(function(data){
                        
                        if(data.success===true)
                        {
                            $localStorage.token=btoa(data.result[0].token);
                            $localStorage.id=btoa(data.result[0].id);
                            $localStorage.nome=btoa(data.result[0].nome);
                            $localStorage.cognome=btoa(data.result[0].cognome);
                            $localStorage.email=btoa(data.result[0].email);
                            $localStorage.id_ruolo=btoa(data.result[0].id_ruolo);
                            $localStorage.room=btoa(data.result[0].room);
                            $localStorage.colorMarker=btoa(data.result[0].colorMarker);
                            $localStorage.photo=btoa(data.result[0].photo);
    
                            toaster.pop({
                                type: 'success',
                                title: 'Connesso',
                                body: 'Benvenuto '+ data.result[0].cognome+" "+data.result[0].nome
                            });
                        }
    
                        let objSend={
                            'idClient':atob($localStorage.id),
                            'nome':atob($localStorage.nome),
                            'cognome':atob($localStorage.cognome),
                            'room':atob($localStorage.room),
                            'status_connected':1
                         };
                       
                       //socket.on('socketLocation', function () {}); //apro connessione socket
                       
                       socket.emit('subscribe', objSend);
                        
                        return $location.path('/home');
                    }).catch(function(err){
                        toaster.pop({
                            type: 'error',
                            title: 'Login',
                            body: 'Accesso Negato'
                        });
                        $localStorage.$reset();
                        return err;
                    });
                }   
            vm.logout = function(){
                let objSend={
                    'logout':{
                                'id':atob($localStorage.id)
                            }
                };
                return LoginService.logout(objSend).then(function(data){
                  
                    objSend.room=atob($localStorage.room);
                    objSend.idClient=atob($localStorage.id);
                    objSend.id_ruolo=atob($localStorage.id_ruolo);
                    objSend.nome=atob($localStorage.nome);
                    objSend.cognome=atob($localStorage.cognome);
                    objSend.status_connected=0;
                    socket.emit('unsubscribe', objSend);
                    //socket.disconnect();//chiudo connessione socket
                    
                    if(data.success===true)
                    {
                        toaster.pop({
                            type: 'warning',
                            title: 'Disconnesso',
                            body: 'Disconnessione Effettuata Con Successo',
                        });
                    }
                    $localStorage.$reset();
                    
                    return $location.path('/login');
                  
                }).catch(function(err){
                    $localStorage.$reset();
                    return $location.path('/login');
                });
            }         
        }
})();
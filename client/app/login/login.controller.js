(function(){
    'use strict';

    angular.module('iLocation')
        .controller('LoginController', LoginController);

        LoginController.$inject=['LoginService','$localStorage','$sessionStorage','$location','toaster','socket'];

        function LoginController(LoginService,$localStorage,$sessionStorage,$location,toaster,socket){
            var vm = this;
            
                vm.loginStatus=function(){
                    if($sessionStorage.token) {
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
                            $sessionStorage.token=btoa(data.result[0].token);
                            $sessionStorage.id=btoa(data.result[0].id);
                            $sessionStorage.nome=btoa(data.result[0].nome);
                            $sessionStorage.cognome=btoa(data.result[0].cognome);
                            $sessionStorage.email=btoa(data.result[0].email);
                            $sessionStorage.id_ruolo=btoa(data.result[0].id_ruolo);
                            $sessionStorage.room=btoa(data.result[0].room);
                            $sessionStorage.colorMarker=btoa(data.result[0].colorMarker);
                            $sessionStorage.photo=btoa(data.result[0].photo);
    
                            toaster.pop({
                                type: 'success',
                                title: 'Connesso',
                                body: 'Benvenuto '+ data.result[0].cognome+" "+data.result[0].nome
                            });
                        }
    
                        let objSend={
                            'idClient':atob($sessionStorage.id),
                            'nome':atob($sessionStorage.nome),
                            'cognome':atob($sessionStorage.cognome),
                            'room':atob($sessionStorage.room),
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
                        $sessionStorage.$reset();
                        return err;
                    });
                }   
            vm.logout = function(){
                let objSend={
                    'logout':{
                                'id':atob($sessionStorage.id)
                            }
                };
                return LoginService.logout(objSend).then(function(data){
                  
                    objSend.room=atob($sessionStorage.room);
                    objSend.idClient=atob($sessionStorage.id);
                    objSend.id_ruolo=atob($sessionStorage.id_ruolo);
                    objSend.nome=atob($sessionStorage.nome);
                    objSend.cognome=atob($sessionStorage.cognome);
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
                    $sessionStorage.$reset();
                    $localStorage.$reset();

                    return $location.path('/login');
                  
                }).catch(function(err){
                    $sessionStorage.$reset();
                    $localStorage.$reset();
                    return $location.path('/login');
                });
            }         
        }
})();
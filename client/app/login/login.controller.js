(function(){
    'use strict';

    angular.module('iLocation')
        .controller('LoginController', LoginController);

        LoginController.$inject=['LoginService','$localStorage','$location','toaster','socket'];

        function LoginController(LoginService,$localStorage,$location,toaster,socket){
            var vm = this;
            vm.login = function(){
                let objSend={
                    'login':vm.user
                };
                return LoginService.login(objSend).then(function(data){
                    
                    if(data.success===true)
                    {
                        $localStorage.token=data.result[0].token;
                        $localStorage.id=data.result[0].id;
                        $localStorage.nome=data.result[0].nome;
                        $localStorage.cognome=data.result[0].cognome;
                        $localStorage.email=data.result[0].email;
                        $localStorage.room=data.result[0].room;
                        $localStorage.colorMarker=data.result[0].colorMarker;

                        toaster.pop({
                            type: 'success',
                            title: 'Connesso',
                            body: 'Benvenuto '+ data.result[0].cognome+" "+data.result[0].nome
                        });
                    }

                    let objSend={
                        'idClient':$localStorage.id,
                        'nome':$localStorage.nome,
                        'cognome':$localStorage.cognome,
                        'room':$localStorage.room,
                        'status':1
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
                                'id':$localStorage.id
                            }
                };
                return LoginService.logout(objSend).then(function(data){
                  
                    objSend.room=$localStorage.room;
                    objSend.idClient=$localStorage.id;
                    objSend.nome=$localStorage.nome;
                    objSend.cognome=$localStorage.cognome;
                    objSend.status=0;
                    
                    socket.emit('unsubscribe', objSend);
                    //socket.disconnect();//chiudo connessione socket
                    
                    if(data.success===true)
                    {
                        toaster.pop({
                            type: 'warning',
                            title: 'Disconnesso',
                            body: 'Disconnessione Effettuata Con Successo',
                        });
                        $localStorage.$reset();
                    }
                   
                    return $location.path('/login');
                }).catch(function(err){
                    $localStorage.$reset();
                    return $location.path('/login');
                });
            }

            

        }
        
})();
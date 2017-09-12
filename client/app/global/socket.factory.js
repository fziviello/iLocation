
(function(){
    'use strict';

    angular.module('iLocation')
        .factory('SocketService', SocketService);

        SocketService.$inject=['socket','btford.socket-io'];

        function SocketService(socket){
           
            var myIoSocket = io.connect("http://localhost:4200"); // da sistemare
            
            return {
                ioSocket: myIoSocket
            }
         
        }
        
})();
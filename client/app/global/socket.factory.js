(function(){
    'use strict';

    angular.module('iLocation')
    .factory('socket', function (socketFactory,$rootScope) {
        var myIoSocket = io.connect($rootScope.URL_SOCKET+$rootScope.PORT_SOCKET,{secure: true});
            var socket = socketFactory({
                ioSocket: myIoSocket
            });
    
            return socket;
        })
})();
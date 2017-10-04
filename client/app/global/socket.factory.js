(function(){
    'use strict';

    angular.module('iLocation')
    .factory('socket', function (socketFactory) {
        var myIoSocket = io.connect("https://192.168.1.24:4200",{secure: true});
            var socket = socketFactory({
                ioSocket: myIoSocket
            });
    
            return socket;
        })
})();
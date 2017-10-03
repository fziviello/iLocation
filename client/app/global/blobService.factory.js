(function(){
    'use strict';

    angular.module('iLocation')
        .factory('BlobService', BlobService);

    function BlobService() {

        var service = {};

        service.dataUrlToBlob = dataUrlToBlob;

        return service;

        function dataUrlToBlob(dataURI) {

            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];

            for (var i = 0; i < binary.length; i++) 
            {
                array.push(binary.charCodeAt(i));
            }

            var fileBlob=new Blob([new Uint8Array(array)], {
                type: mimeString
            });

            return {
                fileBlob: fileBlob
            };
        }
    }
        
})();
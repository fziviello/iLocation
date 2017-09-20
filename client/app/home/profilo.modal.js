(function(){
    'use strict';

    angular.module('iLocation')
        .controller('ProfiloModalController', ProfiloModalController);

        ProfiloModalController.$inject=['dataProfile'];

        function ProfiloModalController(dataProfile){

            var vm = this;
            vm.dataProfile=dataProfile;
        }

})();
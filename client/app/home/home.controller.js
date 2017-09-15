(function(){
    'use strict';

    angular.module('iLocation')
        .controller('HomeController', HomeController);

        HomeController.$inject=['HomeService','toaster','$localStorage','socket'];

        function HomeController(HomeService,toaster,$localStorage,socket){
            
            var vm = this;            
            vm.markers=[];
            vm.elemIndirizzo = document.getElementById("autocomplete");
            vm.Poligono;
            vm.directionsDisplay;
            vm.directionsService;
            vm.directionsDisplays=[];
            vm.segui=$localStorage.segui;

            socket.on('posizione', function (data) {
                vm.addMarkerSocket(data);
            });
            
            socket.on('user-status', function (data) {
                
                if(data.idClient!=$localStorage.id)
                {
                    if(data.status==1)
                    {
                        toaster.pop({
                            type: 'info',
                            title: 'Aggiornamento Utente',
                            body: data.cognome+" "+data.nome+" si è connesso"
                        });
                    }
                    else
                    {
                        vm.deleteMarker(data.idClient);
                        toaster.pop({
                                type: 'info',
                                title: 'Aggiornamento Utente',
                                body: data.cognome+" "+data.nome+" si è disconnesso"
                            });
                    }
               
                     vm.StampaListaUtentiConnessi();
                }

            });

            vm.StampaListaUtentiConnessi = function(){
                
                HomeService.listaUtentiConnessi().then(function(data){
                                            
                    if(data.success===true)
                    {
                        return vm.ListaUtentiConnessi=data;
                    }
                        
                    }).catch(function(err){
                        
                        toaster.pop({
                            type: 'error',
                            title: 'Errore',
                            body: err
                         });

                    });
        }

            vm.FocusUtente=function(idClient) {
              
                for (var i = 0; i < vm.markers.length; i++) 
                    {
                        if(vm.markers[i].id==idClient)
                        {
                            vm.map.setCenter(vm.markers[i].position);
                            vm.segui=idClient;
                            $localStorage.segui=idClient;//segui
                        }
                    }
            }

            vm.MyMap=function() {
                vm.map = new google.maps.Map(document.getElementById('mappa'), {
                 center:  {lat: 42.460570, lng: 14.212260},
                 scrollwheel: true,
                 mapTypeId: google.maps.MapTypeId.TERRAIN,
                 zoom: 15
               });

                 vm.initAutocomplete();
                 vm.geocoder = new google.maps.Geocoder();
                 
                  document.getElementById('cerca').addEventListener('click', function() {
                  vm.geocodeAddress();
                
                });
             
             }

             vm.geocodeAddress=function() {
                
              var indirizzo = document.getElementById('autocomplete').value;
              
              vm.geocoder.geocode({'address': indirizzo}, function(results, status) {
               
               if (status === google.maps.GeocoderStatus.OK) 
               {
                  let titolo="Titolo";
                  vm.map.setCenter(results[0].geometry.location);                  
                        var coordinata=results[0].geometry.location.toString().substring(1, results[0].geometry.location.toString().length - 1).split(',');
                        var posizione = {
                            id:$localStorage.id,
                            lat: Number(coordinata[0]),
                            lng: Number(coordinata[1]),
                            title:$localStorage.cognome+" "+$localStorage.nome,
                            desc:results[0].formatted_address,
                            address:results[0].formatted_address
                        };
            
                        vm.sharePosition(posizione);
                    //console.log(results[0].geometry.location);
                } 
                else 
                {
                  //alert('Errore: ' + status);
                  toaster.pop({
                    type: 'warning',
                    title: 'Attenzione',
                    body: 'I dati inseriti non sono corretti!'
                 });
        
                }
                
                    vm.elemIndirizzo.value ="";
                    
              });
            }

            vm.sharePosition=function(data)
            {
                    var posizione = {
                        id:$localStorage.id,                        
                        lat: Number(data.lat),
                        lng: Number(data.lng),
                        title:data.title,
                        desc:data.desc,
                        address:data.address,
                        room:$localStorage.room,
                        colorMarker:$localStorage.colorMarker,
                 };

                 
                 socket.emit('send-position', posizione);
            }
            vm.fillInAddress=function() {
                $("#cerca").click();
            }

            vm.initAutocomplete=function () {
                vm.autocomplete = new google.maps.places.Autocomplete(
                    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
                    {types: ['geocode']});
                 vm.autocomplete.addListener('place_changed', vm.fillInAddress);
            }

            vm.geolocate=function () {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                      center: geolocation,
                      radius: position.coords.accuracy
                    });
                    autocomplete.setBounds(circle.getBounds());
                  });
                }
            }

         vm.addMarker=function(colorMarker,coodinate,address,title,description,id) {
                
            var marker = new google.maps.Marker({
                id:id,
                position: coodinate,
                address:address,                
                map: vm.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeColor: colorMarker,
                    strokeOpacity: 1,
                    fillColor: colorMarker,
                    fillOpacity: 1,
                    scale: 6
                },
                //icon: 'medias/auto.png',
                animation: google.maps.Animation.DROP,
                title:title,
                description:description
            });
            
            if($localStorage.segui==id)
            {
               vm.map.setCenter(coodinate);
            }
            
            var infowindow = new google.maps.InfoWindow({
                content: marker.title+"<br/>"+marker.description
            });
            
                marker.addListener('click', function() {
                infowindow.open(vm.map, marker);
            });
            
                vm.markers.push(marker);
                vm.elemIndirizzo.value ="";
        }

        vm.deleteObjectMap=function() {
            
            vm.deleteMarkers();
            vm.deletePoligono();
            vm.deleteDirectionsDisplays();
        
        }

        vm.deleteMarkers=function() {
            
            for (var i = 0; i < vm.markers.length; i++) 
            {
                 vm.markers[i].setMap(null);
            }
                
            vm.markers = [];
        }

        vm.deleteMarker=function(id) {
            
            for (var i = 0; i < vm.markers.length; i++) 
            {
                if(vm.markers[i].id==id)
                {
                    vm.markers[i].setMap(null);
                    vm.markers.splice(i,1);
                }
                
            }
                
        }

        vm.deleteDirectionsDisplays=function() {
            
            for (var i = 0; i < vm.directionsDisplays.length; i++) 
            {
                vm.directionsDisplays[i].setMap(null);
                vm.directionsDisplays[i].setPanel(null);
            }
            
            vm.directionsDisplays=[];
            vm.elemIndirizzo.value ="";
        }

        vm.deletePoligono=function() {
            if(vm.Poligono!=null)
            {
                 vm.Poligono.setMap(null);
            }
        }

        vm.CreaPoligono=function()
        {
            if(vm.Poligono!=null)
            {
                vm.Poligono.setMap(null);
            }
        
            var puntiPoligono=[];
            
            var lineSymbol = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                strokeColor: '#B3D1FF'
              };
        
            if(vm.markers.length<=1)
            {
                toaster.pop({
                    type: 'error',
                    title: 'Errore',
                    body: 'Devi Creare almeno 2 punti'
                 });
            }
            else
            {
                for (var i = 0; i < vm.markers.length; i++) 
                {
                    puntiPoligono.push(vm.markers[i].position);
                }
                
                    puntiPoligono.push(vm.markers[0].position); //chiudo il poligiono
                
                    vm.Poligono = new google.maps.Polyline({
                    path: puntiPoligono,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: [{
                      icon: lineSymbol,
                      offset: '100%'
                    }],
        
                });
        
                vm.Poligono.setMap(vm.map);
                vm.NavigaPoligono(vm.Poligono);
        
            }
        }

        vm.NavigaPoligono=function(line) {
            var count = 0;
            window.setInterval(function() {
              count = (count + 1) % 200;
              var icons = line.get('icons');
              icons[0].offset = (count / 2) + '%';
              line.set('icons', icons);
          }, 20);
        }
        
        vm.CalcolaPercorso=function() {
            
              if(vm.markers.length<=1)
              {
                toaster.pop({
                    type: 'error',
                    title: 'Errore',
                    body: 'Devi Creare almeno 2 punti'
                 });
              }
              else
              {
                  vm.deleteDirectionsDisplays();
                  vm.directionsDisplay = new google.maps.DirectionsRenderer;
                  vm.directionsService = new google.maps.DirectionsService;
                  
                  vm.directionsDisplay.setMap(vm.map);
                  
                    var waypts = [];
                    for (var i =0; i <= vm.markers.length-1; i++) 
                    {
                        waypts.push({
                            location: vm.markers[i].address,
                            stopover: true
                            });
                    }
                  vm.directionsService.route({
                    origin: vm.markers[0].position,
                    destination: vm.markers[vm.markers.length-1].position,
                    waypoints:waypts,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode['DRIVING']
                  },function(response, status) {

                    if (status == google.maps.DirectionsStatus.OK) 
                    {
                      vm.directionsDisplay.setDirections(response);
                      vm.directionsDisplay.setPanel(document.getElementById('BoxPercorso'));
                      var control = document.getElementById('infoPercoso');
                      vm.map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
                      vm.directionsDisplays.push(vm.directionsDisplay);
                    } 
                    else 
                    {
                       toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: 'Impossibile Calcolare la Rotta'
                     });
                    }
                  });
              }
              
            }

            vm.addMarkerSocket=function(data)
            {
                let posizione = {
                    lat: Number(data.lat),
                    lng: Number(data.lng)
                };
                
                let title=data.title;
                let address=data.address;
                let desc=data.desc;
                let idClient=data.id;
                let idSocketClient=data.idSocketClient
                let room=data.room;
                let colorMarker=data.colorMarker;

                vm.deleteMarker(idClient);
                vm.addMarker(colorMarker,posizione,address,title,desc,idClient);
        
            }

            vm.myPosition=function()
            {
                if (navigator.geolocation) 
                {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                            vm.geocoder.geocode({'location': pos}, function(results, status) {
                                if (status === 'OK') 
                                {
                                    let titolo="Posizione Corrente";
                                    vm.map.setCenter(results[0].geometry.location);
                                    var coordinata=results[0].geometry.location.toString().substring(1, results[0].geometry.location.toString().length - 1).split(',');
                                    var posizione = {
                                        id:$localStorage.id,
                                        lat: Number(coordinata[0]),
                                        lng: Number(coordinata[1]),
                                        title:$localStorage.cognome+" "+$localStorage.nome,
                                        desc:results[0].formatted_address,
                                        address:results[0].formatted_address
                                    };
                                    vm.sharePosition(posizione);
                                }
                                else
                                {
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Errore',
                                        body: 'Impossibile Rilevare la Posizione Corrente'
                                        });
                                }
                            });
                        });
                } 
                else
                {
                    toaster.pop({
                        type: 'error',
                        title: 'Errore',
                        body: 'Impossibile Rilevare la Posizione Corrente'
                        });
                    }
                }
            }
        
})();
import './styles/main.css'

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 20.67373109999999, lng: -105.2414225}
  });
  directionsDisplay.setMap(map);

  var onChangeHandler = function(destino) {
    calculateAndDisplayRoute(directionsService, directionsDisplay, destino);
  };

  var input = document.getElementById('autocomplete');
  // var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(cities)']});
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', async function() {
    var place = await autocomplete.getPlace();
    // Validar si regreso un valor diferente a undefined o algun error
    onChangeHandler({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    })
  })
}

window.initMap = initMap;

function calculateAndDisplayRoute(directionsService, directionsDisplay, destino) {
  const { lat, lng } = destino
  directionsService.route({
    // ver si se puede pasar destino por longitud y latitud
    origin: {lat: 20.67373109999999, lng: -105.2414225},
    destination: {lat, lng},
    travelMode: 'DRIVING',
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      // console.log(response.routes[0].legs[0].distance.value)
      total = response.routes[0].legs[0].distance.value / 1000;
      duration = response.routes[0].legs[0].duration.value;

      // var hours = new Date(duration * 1000).toISOString().substr(11, 8);

      let totalSeconds = duration;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      // let seconds = totalSeconds % 60;

      document.getElementById('total').innerHTML = total + ' km';
      document.getElementById('duration').innerHTML = hours + ' horas ' + minutes + ' minutos';
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

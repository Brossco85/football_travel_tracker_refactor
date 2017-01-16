var MapWrapper = function(container, center, zoom){
 this.googleMap = new google.maps.Map(container, {
   center: center, 
   zoom: zoom
 });

 directionsService = new google.maps.DirectionsService;
 directionsDisplay = new google.maps.DirectionsRenderer;
 directionsDisplay.setMap(this.googleMap);
 directionsDisplay.setPanel(document.getElementById('directions'));

 google.maps.event.addDomListener(window, "resize", function() {
  var center = this.googleMap.getCenter();
  google.maps.event.trigger(this.googleMap, "resize");
  this.googleMap.setCenter(center);
}.bind(this));

 var locationButton = document.querySelector('#location-button');
 locationButton.onclick = getLocation;

}



MapWrapper.prototype = {
 addMarker: function(coords, icon){
   var marker = new google.maps.Marker({
     position: coords,
     icon: icon,
     map: this.googleMap
   })
 },
 setCenter: function(coords){
   this.googleMap.setCenter(coords);
 },
 setLocation: function(coords){
   this.addMarker(coords);
   this.setCenter(coords);
 },
 initDirections: function(origin, destination){ 
  calculateAndDisplayRoute(this.googleMap, origin, destination);
},
satelliteCloseUp: function(){
  this.googleMap.setMapTypeId('satellite');
  this.googleMap.setZoom(17);
},

itineraryMarker: function(coords, place, address, phone) {
  var marker = new google.maps.Marker({
    position: coords,
    map: this.googleMap
  });
  this.addInfoWindow(place, address, phone).open(marker.map, marker);
},

addInfoWindow: function(place, address, phone) {
  var contentString = place + "<br />" + address + "<br />" + phone;
  var window = new google.maps.InfoWindow({
    content: contentString
  });
  return window;
}

}

function getLocation() {
  var container = document.getElementById('map');
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var location = {lat: latitude, lng: longitude};
    var locationButton = document.querySelector('#location-button');
    var clubLocation = JSON.parse(locationButton.data);
    var container = document.getElementById('map');
    var coords = {lat: 51.6032, lng: 0.0657}; 
    var mainMap = new MapWrapper(container, coords, 6);

    mainMap.initDirections(location, clubLocation);
  }

  function error() {
    container.innerHTML = "Unable to retrieve your location";
  }
  container.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.getCurrentPosition(success, error);
}


function calculateAndDisplayRoute(map, origin, destination) {
 directionsService.route({origin: origin, destination: destination,
   travelMode: 'DRIVING'
 }, function(response, status) {
  if (status === 'OK') {
    document.getElementById('warnings-panel').innerHTML =
    '<b>' + response.routes[0].warnings + '</b>';
    document.getElementById("directions").innerHTML = "";
    directionsDisplay.setDirections(response);
  } else {
    window.alert('Directions request failed due to ' + status);
  }
});
}

module.exports = MapWrapper;





var MapWrapper = require('./mapWrapper.js');


var PLStadiums = function(){
    var container = document.getElementById('map');
    var coords = {lat: 52.9548, lng: -1.1581};  
    var mainMap = new MapWrapper(container, coords, 7);



    var url = 'http://localhost:3000/api/stadiums';
    makeRequest(url, function(){
      if (this.status !== 200) return;
      var jsonString = this.responseText;
      var stadiums = JSON.parse(jsonString);
      var allStadiums = getStadiumData(stadiums);
      getClubNames(allStadiums);

      for(var stadium of allStadiums){
        var icon = {
                    url: stadium.crest, // url
                    scaledSize: new google.maps.Size(20, 30), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                  };
                  mainMap.addMarker(stadium.latlng, icon);
                };
              })


    var select = document.querySelector('#team');
    select.addEventListener('change', function(e){
      getStadiumCoords(e.target.value, mainMap);
    })


  }


  var makeRequest = function(url, callback){
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = callback;
    request.send();
  }


  var getStadiumData = function(stadiums){
    var data = [];
    stadiums.forEach(function(stadium){
      var stadiData = {};
      stadiData = {name: stadium.name, crest: stadium.crestURL, stadium: stadium.stadium, latlng: {lat: stadium.latlng[0], lng: stadium.latlng[1]}};
      data.push(stadiData);

    })
    return data;
  }

  var getClubNames = function(stadiums){
    var select = document.querySelector('#team');
    for (var i = 0; i < stadiums.length; i++) {
      var option = document.createElement('option') ;
      option.innerText = stadiums[i].name;
      option.value = i;
      select.appendChild(option); 
    }
  }

  var getStadiumCoords = function(index, map){
    var url = 'http://localhost:3000/api/stadiums';
    makeRequest(url, function(){
      if (this.status !== 200) return;
      var jsonString = this.responseText;
      var stadiums = JSON.parse(jsonString);
      var allStadiums = getStadiumData(stadiums);
      var coords = {};
      coords = {lat: allStadiums[index].latlng.lat, lng: allStadiums[index].latlng.lng};
      map.setCenter(coords);
      // map.satelliteCloseUp();
      var origin = {lat: 51.6032, lng: 0.0657};
      var destination = coords;
      map.initDirections(origin, destination);
    })
  }

module.exports = PLStadiums;







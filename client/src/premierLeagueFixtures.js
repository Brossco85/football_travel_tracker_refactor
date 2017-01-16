var MapWrapper = require('./mapWrapper.js');


var PremierLeagueFixtures = function(){
  var url = 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=21';
  makeRequest(url, requestComplete);


  var hotspots = document.getElementById('hotspots')
  hotspots.addEventListener('change', function(e){
    if(e.target.checked){
      console.log(e.target.checked);

    } else{
      console.log(false);
    }
  })

  var form = document.getElementById('hotspots');
  form.onsubmit = function(e){
    e.preventDefault();
    var places = [];
    var checkBox = form.getElementsByTagName('input');
    for (var i = 0; i < checkBox.length; i++) {
      if(checkBox[i].checked){
        places.push(checkBox[i].value);
      }
    }

    var itinerary = {
      user: "Euan",
      match: parseFloat(e.target.amount.value),
      startTime: e.target.type.value,
      hotspots: e.target
    }
    console.log(places);
  }



}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.setRequestHeader("X-Auth-Token", "795581b721014c898569d2bee06c9012");
  request.onload = callback;
  request.send();
}

var requestComplete = function(){
  if (this.status !== 200) return;
  var jsonString = this.responseText;
  var fixturesData = JSON.parse(jsonString);
  createFixturesTable(fixturesData, assignOnClick);
}

var createFixturesTable = function(fixturesData, callback){
  var fixtures = fixturesData.fixtures;
  var table = document.getElementById('fixture-elements');
  for (i = 0; i < fixtures.length; i++) {
    var tr = document.createElement('tr');
    tr.setAttribute("class", "click-fixture");
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');
    var img = document.createElement('img');
    var fixture = fixtures[i];
    var dateAndTime = fixture.date;
    var date = new Date(dateAndTime);
    td1.innerText = fixture.matchday;
    td2.innerText = "";
    td3.innerText = date.toDateString();
    td4.innerText = "";
    td5.innerText = fixture.homeTeamName;
    td6.innerText = "";
    td7.innerText = fixture.awayTeamName;
    td8.innerText = "";
    td9.innerText = date.toUTCString().slice(16,22);
    table.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr.value = fixture.awayTeamName;
    callback();
  }
}

// var getDirectionsLocation = function(homeTeam, awayTeam){
//   var url = 'http://localhost:3000/api/stadiums';
//   makeRequest(url, function(){
//     if (this.status !== 200) return;
//     var jsonString = this.responseText;
//     var stadiums = JSON.parse(jsonString);
//     var allStadiums = getStadiumData(stadiums);
//     // var homeCoords = {};
//     // var awayCoords = {};
//     for (var stadium of allStadiums){  
//       if (stadium.name === homeTeam){
//         var homeCoords = {lat: stadium.latlng.lat, lng: stadium.latlng.lng};
//       } else if (stadium.name === awayTeam){
//         var awayCoords = {lat: stadium.latlng.lat, lng: stadium.latlng.lng};
//       }
//     }
//     var container = document.getElementById('map');
//     var coords = {lat: 51.6032, lng: 0.0657};  
//     var mainMap = new MapWrapper(container, coords, 6);

//     mainMap.initDirections(awayCoords, homeCoords);
//   })
// }


var assignOnClick =function (){
  tables = document.getElementById("fixture-elements");
  cells = tables.getElementsByTagName('tr');
  rows = tables.getElementsByTagName('td');
  for (var i=0,len=cells.length; i<len; i++){
    cells[i].onclick = function(){
document.getElementById("directions").style.display = "block";
      var home = this.children[4].innerText;
      var away = this.children[6].innerText;
      var fixture = this.innerText;
      getHotspots(home, fixture);
      showHotspots(home);
      getFixtureDirections(home, away);
    }
  }
}

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

var createCheckbox = function(name) {
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.value = name;
  checkbox.id = "id";

  var label = document.createElement('label')
  label.htmlFor = "id";
  label.appendChild(document.createTextNode(name));

  return [checkbox, label];
}

var getHotspots = function(homeTeam, fixture) {
  var url = 'http://localhost:3000/api/stadiums';
  makeRequest(url, function(){
    if (this.status !== 200) return;
    var jsonString = this.responseText;
    var stadiums = JSON.parse(jsonString);
    document.getElementById('hotspots').innerHTML = "";
    // document.getElementById('hotspots');
    var locationButton = document.getElementById('location-button');
    var tickets = document.getElementById('tickets');
    var itineraryList = document.getElementById('itinerary-list');
    itineraryList.innerText = fixture;
    
    for (var stadium of stadiums) {
      if (stadium.name == homeTeam) {
        var latitude  = stadium.latlng[0];
        var longitude = stadium.latlng[1];
        var location = {lat: latitude, lng: longitude};
        locationButton.data = JSON.stringify(location);
        tickets.setAttribute("onclick", "window.open(" + "'" + stadium.website + "'" + ")");
        getStadiumSpots(stadium, 'pubs')
        getStadiumSpots(stadium, 'foodOutlets')
        getStadiumSpots(stadium, 'hotels')

      }
    }
  })
}

var getFixtureDirections = function(homeTeam, awayTeam){
  var url = 'http://localhost:3000/api/stadiums';
  makeRequest(url, function(){
    if (this.status !== 200) return;
    var jsonString = this.responseText;
    var stadiums = JSON.parse(jsonString);
    var allStadiums = getStadiumData(stadiums);
    var homeCoords = {};
    var awayCoords = {};
    for (var stadium of allStadiums){  
      if (stadium.name === homeTeam){
        var homeCoords = {lat: stadium.latlng.lat, lng: stadium.latlng.lng};
      } else if (stadium.name === awayTeam){
        var awayCoords = {lat: stadium.latlng.lat, lng: stadium.latlng.lng};
      }
    }
    var container = document.getElementById('map');
    var coords = {lat: 51.6032, lng: 0.0657};  
    var mainMap = new MapWrapper(container, coords, 6);

    mainMap.initDirections(awayCoords, homeCoords);
  })
}


var viewButton = function() {
  var popup = document.getElementById('myPopup');
  popup.classList.toggle('show');;
}

var showHotspots = function(homeTeam) {
  var url = 'http://localhost:3000/api/stadiums';
  makeRequest(url, function() {
    if (this.status !== 200) return;
    var jsonString = this.responseText;
    var stadiums = JSON.parse(jsonString);
    var container = document.getElementById('itinerary-map');
    for (var stadium of stadiums) {
      if (stadium.name == homeTeam) {
        var coords = {lat: stadium.latlng[0], lng: stadium.latlng[1]};
        var itineraryMap = new MapWrapper(container, coords, 11);
        getItineraryMarkers(itineraryMap, stadium, 'pubs')
        getItineraryMarkers(itineraryMap, stadium, 'foodOutlets')
        getItineraryMarkers(itineraryMap, stadium, 'hotels')
      }
    }
  })
}

var getStadiumSpots = function (stadium, hotspot){
  for (i = 0; i < stadium[hotspot].length; i++) {
    var liReturn = createCheckbox(stadium[hotspot][i].name)
    hotspots.appendChild(liReturn[0]);
    hotspots.appendChild(liReturn[1]);
  }
}

var getItineraryMarkers = function(map, stadium, hotspot){
  for (i = 0; i < stadium[hotspot].length; i++) {
    map.itineraryMarker({lat: stadium[hotspot][i].latlng[0], lng: stadium[hotspot][i].latlng[1]}, stadium[hotspot][i].name, stadium[hotspot][i].address, stadium[hotspot][i].phoneNumber);
  }
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

module.exports = PremierLeagueFixtures;












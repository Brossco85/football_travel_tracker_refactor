/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MapWrapper = __webpack_require__(1);
	var PremierLeagueFixtures = __webpack_require__(2);
	var PremierLeagueTable = __webpack_require__(5);
	var FootballFeed = __webpack_require__(3);
	var PLStadiums = __webpack_require__(4);
	
	
	var app = function() {
	  var table = new PremierLeagueTable();
	  var stadiums = new PLStadiums();
	  var fixtures = new PremierLeagueFixtures();
	  var feed = new FootballFeed();
	
	}
	
	
	window.onload = app;
	
	
	


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	
	
	
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var MapWrapper = __webpack_require__(1);
	
	
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
	
	
	
	
	
	
	
	
	
	
	


/***/ },
/* 3 */
/***/ function(module, exports) {

	var FootballFeed = function(){
	
	    var url = 'http://feeds.bbci.co.uk/sport/football/rss.xml';
	    var feedArea = document.getElementById('feeds');
	    var table = document.getElementById('feed-list');
	    feednami.load(url).then(feed => {
	      var stories = feed.entries;
	        for (i = 0; i < stories.length; i++) {
	          var tr = document.createElement('tr');
	          var td = document.createElement('td');
	          var a = document.createElement('a');
	          var p = document.createElement('p');
	          var spacer = document.createElement('p');
	          var time = document.createElement('p');
	          var img = document.createElement('img');
	          var story = stories[i];
	          var dateAndTime = new Date(story.pubdate);
	          a.setAttribute("class", "story-link");
	          a.innerHTML = story.title;
	          a.href = story.permalink;
	          a.setAttribute("id", "story-title");
	          a.setAttribute("target", "_blank");
	          p.setAttribute("class", "story-link");
	          p.innerText = story.description;
	          spacer.innerText = "";
	          img.setAttribute("id", "football-photo");
	          img.setAttribute("src", story.image.url);
	          time.innerText = dateAndTime.toUTCString().slice(0,22);
	          table.appendChild(time);
	          time.appendChild(tr);
	          tr.appendChild(td);
	          td.appendChild(a);
	          a.appendChild(spacer);
	          spacer.append(p);
	          p.append(img); 
	        }
	      })
	}
	
	module.exports = FootballFeed;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var MapWrapper = __webpack_require__(1);
	
	
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
	
	
	
	
	
	


/***/ },
/* 5 */
/***/ function(module, exports) {

	var PremierLeagueTable = function(){
	  var url = 'http://api.football-data.org/v1/competitions/426/leagueTable';
	  makeRequest(url, requestComplete);
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
	  console.log(jsonString);
	  var league = JSON.parse(jsonString);
	  createLeagueTable(league);
	}
	
	var createLeagueTable = function(leagueData){
	  var standing = leagueData.standing;
	  var table = document.getElementById('table-elements');
	    for (i = 0; i < standing.length; i++) {
	      var tr = document.createElement('tr');
	      var td1 = document.createElement('td');
	      var td2 = document.createElement('td');
	      var td3 = document.createElement('td');
	      var td4 = document.createElement('td');
	      var td5 = document.createElement('td');
	      var td6 = document.createElement('td');
	      var td7 = document.createElement('td');
	      var td8 = document.createElement('td');
	      var td9 = document.createElement('td');
	      var td10 = document.createElement('td');
	      var td11 = document.createElement('td');
	      var img = document.createElement('img');
	      var team = standing[i];
	      img.setAttribute("src", team.crestURI);
	      img.setAttribute("id", "crest-picture")
	      td1.innerText = i + 1;
	      td2.appendChild(img);
	      td3.innerText = team.teamName;
	      td4.innerText = team.playedGames;
	      td5.innerText = team.wins;
	      td6.innerText = team.draws;
	      td7.innerText = team.losses;
	      td8.innerText = team.goals;
	      td9.innerText = team.goalsAgainst;
	      td10.innerText = team.goalDifference;
	      td11.innerText = team.points;
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
	      tr.appendChild(td10);
	      tr.appendChild(td11);
	      
	    }
	
	}
	
	module.exports = PremierLeagueTable;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
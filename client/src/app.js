var MapWrapper = require('./mapWrapper.js');
var PremierLeagueFixtures = require('./premierLeagueFixtures.js');
var PremierLeagueTable = require('./premierLeagueData.js');
var FootballFeed = require('./footballFeed.js');
var PLStadiums = require('./PLStadiums.js');


var app = function() {
  var table = new PremierLeagueTable();
  var stadiums = new PLStadiums();
  var fixtures = new PremierLeagueFixtures();
  var feed = new FootballFeed();

}


window.onload = app;




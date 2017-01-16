var Itinerary = function(params){
  this.user = params.user;
  this.match = params.match;
  this.startTime = params.startTime;
  this.hotspots = params.hotspots;
};

module.exports = Itinerary;
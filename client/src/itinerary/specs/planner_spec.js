var Planner = require('../planner');
var Itinerary = require('../itinerary');
var assert = require('assert');

var itinerary;
var planner;

describe('planner', function() {

  beforeEach(function(){
    planner = new Planner();
    itinerary = new Itinerary({user:'Bobby', match:"Sat Dec 17 2016 Crystal Palace FC vs Chelsea FC 12:30", startTime: "10:30", pubs: [], eateries: [], hotels: []});
    itinerary2 = new Itinerary({user:'Euan', match:"  Sun Dec 18 2016 Manchester City FC vs Arsenal FC 16:00", startTime: "14:00", pubs: ["The Bucks"], eateries: ["Macdonalds"], hotels: ["One Hotel"]});
    planner.addItinerary(itinerary);
    planner.addItinerary(itinerary2);
  });

  it('should have itineraries', function() {
    assert.equal(planner.planner.length, 2);
  });

  it("should find itinerary by user", function(){
    assert.deepEqual(itinerary2, planner.findItineraryByUser("Euan"));
  })

});
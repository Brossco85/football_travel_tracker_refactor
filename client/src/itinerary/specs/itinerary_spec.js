var Itinerary = require('../itinerary');
var assert = require('assert');

var itinerary;

describe('itinerary', function() {

  beforeEach(function(){
    itinerary = new Itinerary({user:'Bobby', match:"Sat Dec 17 2016 Crystal Palace FC vs Chelsea FC 12:30", startTime: "10:30", pubs: [], eateries: [], hotels: []});
  });

  it('should have user', function() {
    assert.equal(itinerary.user, 'Bobby');
  });

  it('should have match', function() {
    assert.equal(itinerary.match, "Sat Dec 17 2016 Crystal Palace FC vs Chelsea FC 12:30");
  });

  it('should have start time', function() {
    assert.equal(itinerary.startTime, "10:30");
  });

  it('should have no pubs', function() {
    assert.equal(itinerary.pubs.length, 0);
  });

});

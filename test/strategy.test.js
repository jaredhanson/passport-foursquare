/* global describe, it, expect */
/* jshint expr: true */

var FoursquareStrategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new FoursquareStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  it('should be named foursquare', function() {
    expect(strategy.name).to.equal('foursquare');
  });
  
});

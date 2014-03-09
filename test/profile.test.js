/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {
    
  describe('profile using API version 20120504', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/data/20120504.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('1419');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.gender).to.equal('male');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('jaredhanson@example.com');
    });
  });
  
  describe('profile using API version 20140308', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/data/20140308.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('1419');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.gender).to.equal('male');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('jaredhanson@example.com');
    });
  });
  
});

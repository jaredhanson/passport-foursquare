/* global describe, it, expect, before */
/* jshint expr: true */

var FoursquareStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  var strategy =  new FoursquareStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
  
  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (url != 'https://api.foursquare.com/v2/users/self?v=20140308') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
    
    var body = '{"meta":{"code":200},"notifications":[{"type":"notificationTray","item":{"unreadCount":0}}],"response":{"user":{"id":"1419","firstName":"Jared","lastName":"Hanson","photo":"https://playfoursquare.s3.amazonaws.com/userpix_thumbs/1419_1238423817.jpg","gender":"male","homeCity":"Oakland, CA","relationship":"self","type":"user","pings":false,"contact":{"phone":"5105551234","email":"jaredhanson@example.com","twitter":"jaredhanson","facebook":"500308595"}}}}';
  
    callback(null, body, undefined);
  };
    
  describe('loading profile', function() {
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('foursquare');
      
      expect(profile.id).to.equal('1419');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.gender).to.equal('male');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('jaredhanson@example.com');
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('encountering an error', function() {
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });
  
});

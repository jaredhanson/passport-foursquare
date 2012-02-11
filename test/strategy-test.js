var vows = require('vows');
var assert = require('assert');
var util = require('util');
var FoursquareStrategy = require('passport-foursquare/strategy');


vows.describe('FoursquareStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new FoursquareStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named foursquare': function (strategy) {
      assert.equal(strategy.name, 'foursquare');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new FoursquareStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{"meta":{"code":200},"notifications":[{"type":"notificationTray","item":{"unreadCount":0}}],"response":{"user":{"id":"1419","firstName":"Jared","lastName":"Hanson","photo":"https://playfoursquare.s3.amazonaws.com/userpix_thumbs/1419_1238423817.jpg","gender":"male","homeCity":"Oakland, CA","relationship":"self","type":"user","pings":false,"contact":{"phone":"5105551234","email":"jaredhanson@example.com","twitter":"jaredhanson","facebook":"500308595"}}}}';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'foursquare');
        assert.equal(profile.id, '1419');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
        assert.equal(profile.gender, 'male');
        assert.lengthOf(profile.emails, 1);
        assert.equal(profile.emails[0].value, 'jaredhanson@example.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new FoursquareStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);

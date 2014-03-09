var vows = require('vows');
var assert = require('assert');
var util = require('util');
var foursquare = require('..');


vows.describe('passport-foursquare').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(foursquare.version);
    },
  },
  
}).export(module);

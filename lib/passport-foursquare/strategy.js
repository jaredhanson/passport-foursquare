/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Fourquare authentication strategy authenticates requests by delegating to
 * Foursquare using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Foursquare application's App ID
 *   - `clientSecret`  your Foursquare application's App Secret
 *   - `callbackURL`   URL to which Foursquare will redirect the user after granting authorization
 *   - `apiVersion`    the Foursquare API version to use for requesting the user profile
 *
 * Examples:
 *
 *     passport.use(new FoursquareStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/foursquare/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://foursquare.com/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://foursquare.com/oauth2/access_token';
  options.apiVersion = options.apiVersion || '20120504';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'foursquare';

  // Foursquare expects a date-based version string to be passed in now and 
  // has begun warning clients that do not include it with the following in
  // the response:
  // 
  // errorType: 'deprecated',
  // errorDetail: 'Please provide an API version to avoid future errors.See http://bit.ly/vywCav'
  // 
  this.apiVersion = options.apiVersion;
  
  // NOTE: Due to OAuth 2.0 implementations arising at different points and
  //       drafts in the specification process, the parameter used to denote the
  //       access token is not always consistent.    As of OAuth 2.0 draft 22,
  //       the parameter is named "access_token".  However, Foursquare's
  //       implementation expects it to be named "oauth_token".  For further
  //       information, refer to: https://developer.foursquare.com/docs/oauth.html
  this._oauth2.setAccessTokenName("oauth_token");
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Foursquare.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `foursquare`
 *   - `id`               unique identifier for this user.
 *   - `name.familyName`  user's last name
 *   - `name.givenName`   user's first name
 *   - `gender`           the user's gender: `male` or `female`
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = 'https://api.foursquare.com/v2/users/self';
  if (this.apiVersion) {
    url += '?v=' + this.apiVersion;
  }
  this._oauth2.get(url, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'foursquare' };
      profile.id = json.response.user.id;
      profile.name = { familyName: json.response.user.lastName,
                       givenName: json.response.user.firstName };
      profile.gender = json.response.user.gender;
      profile.emails = [{ value: json.response.user.contact.email }];
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

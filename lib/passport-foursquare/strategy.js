/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


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
 *   - `clientID`      your Facebook application's App ID
 *   - `clientSecret`  your Facebook application's App Secret
 *   - `callbackURL`   URL to which Facebook will redirect the user after granting authorization
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
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'foursquare';
  
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
  this._oauth2.getProtectedResource('https://api.foursquare.com/v2/users/self', accessToken, function (err, body, res) {
    if (err) { return done(err); }
    
    try {
      o = JSON.parse(body);
      
      var profile = { provider: 'foursquare' };
      profile.id = o.response.user.id;
      profile.name = { familyName: o.response.user.lastName,
                       givenName: o.response.user.firstName };
      profile.gender = o.response.user.gender;
      profile.emails = [{ value: o.response.user.contact.email }];
      
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

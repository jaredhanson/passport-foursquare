# passport-foursquare

[![Build](https://travis-ci.org/jaredhanson/passport-foursquare.png)](https://travis-ci.org/jaredhanson/passport-foursquare)
[![Coverage](https://coveralls.io/repos/jaredhanson/passport-foursquare/badge.png)](https://coveralls.io/r/jaredhanson/passport-foursquare)
[![Quality](https://codeclimate.com/github/jaredhanson/passport-foursquare.png)](https://codeclimate.com/github/jaredhanson/passport-foursquare)
[![Dependencies](https://david-dm.org/jaredhanson/passport-foursquare.png)](https://david-dm.org/jaredhanson/passport-foursquare)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)

[Passport](http://passportjs.org/) strategy for authenticating with [Foursquare](https://foursquare.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Foursquare in your Node.js applications.
By plugging into Passport, Foursquare authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-foursquare

## Usage

#### Configure Strategy

The Foursquare authentication strategy authenticates users using a Foursquare
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new FoursquareStrategy({
        clientID: FOURSQUARE_CLIENT_ID,
        clientSecret: FOURSQUARE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/foursquare/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ foursquareId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'foursquare'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/foursquare',
      passport.authenticate('foursquare'));

    app.get('/auth/foursquare/callback', 
      passport.authenticate('foursquare', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-foursquare/tree/master/examples/login).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>


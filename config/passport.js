// load all the things we need
var express  = require('express');
var app      = express();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var session = require('express-session');
app.use(session({secret: 'testing123'}));

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, {
            id: id
        });
    });
    passport.use(new FacebookStrategy({
        'clientID': "1722638001103454",
        'clientSecret': "df727df09124bb3a49d3af368443ed79",
        'callbackURL': "http://127.0.0.1:8080/auth/facebook/callback",
        'passReqToCallback' : true
    },
    function (request, token, refreshToken, profile, done) {
            console.log(profile);
            // set all of the relevant information
            var sessionData = request.session;
            sessionData.id = profile.id;
            sessionData.token = token;
            sessionData.displayName = profile.displayName;
            done(null, {
                id: profile.id,
                token: token,
                displayName : profile.displayName,
            });
        }
    ));
};
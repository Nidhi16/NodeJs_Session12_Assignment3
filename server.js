var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var session = require('express-session');
app.use(session({secret: 'testing123'}));  // session secret

app.use(passport.initialize());
app.use(passport.session());  // persistent login sessions

require('./config/passport')(passport);  // pass passport for configuration

app.set('view engine', 'ejs');  // set up ejs for templating

// route for home page
app.get('/', function(request, response) {
   response.render('index.ejs');
});

// route for showing the profile page
app.get('/profile', function(request, response) {
    // get the user out of session and pass to template
    var id = request.session.id;
    var token = request.session.token;
    var displayName = request.session.displayName;
    response.render('profile.ejs', {'id': id, 'displayName': displayName, 'token': token});
});

// send to facebook to do the authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

// launch
app.listen(port, function(){
    console.log("Listening to port " + port);
});
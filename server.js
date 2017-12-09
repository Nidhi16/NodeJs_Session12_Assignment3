var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var bodyParser = require('body-parser');
var session = require('express-session');
app.use(session({secret: 'testing123'}));

app.use(bodyParser.urlencoded({ extended:false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.get('/', function(request, response) {
   response.render('index.ejs');
});

app.get('/profile', function(request, response) {
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

app.listen(port, function(){
    console.log("Listening to port " + port);
});

var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

mongoose.connect('mongodb://localhost/logo');

require('./config/passport')(passport);
require('./config/passport-facebook')(passport);
require('./config/passport-twitter')(passport);

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());

	app.use(express.session({ secret: 'iloveexpresslogo' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

});

require('./routes/routes.js')(app, passport);
require('./routes/routes-facebook.js')(app, passport);
require('./routes/routes-twitter.js')(app, passport);
require('./routes/routes-gallery.js')(app);
require('./routes/routes-profile.js')(app);
require('./routes/routes-notification.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

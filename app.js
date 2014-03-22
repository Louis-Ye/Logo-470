
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

mongoose.connect('mongodb://localhost/logo');

require('./config/passport')(passport); 

app.configure(function() {

	app.set('port', process.env.PORT || 8080);
	app.set('views', path.join(__dirname, 'views'));
	app.use(express.logger('dev')); 
	app.use(express.cookieParser()); 
	app.use(express.bodyParser()); 
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.set('view engine', 'ejs');

	app.use(express.session({ secret: 'ilovelogologo' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

});

require('./routes/routes.js')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = function(app, passport) {

	app.get('/user', isLoggedIn, function(req, res) {
		var user = req.user;
		var register = user.register;
		res.send({
			email : user[register].email,
			name : user[register].name,
			avatar : user[register].avatar
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/#/');
	});

	app.get('/login', function(req, res) {
		res.send({ message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/#/', // redirect to the secure profile section
		failureRedirect : '/#/sign-in', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/signup', function(req, res) {	
		var message = { message: req.flash('signupMessage') };
		res.send(message);
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/#', // redirect to the secure profile section
		failureRedirect : '/#/sign-up', // redirect back to the signup page if there is an error
		failureFlash : true  // allow flash messages
	}));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

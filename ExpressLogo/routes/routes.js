var User = require('../models/user');

module.exports = function(app, passport) {

	//get user own information
	app.get('/user', isLoggedIn, function(req, res) {
		var user = req.user;
		var register = user.register;
		res.send({
			register : user.register,
			email : user[register].email,
			name : user[register].name,
			avatar : user[register].avatar
		});
	});

	//find a user by id
	app.get('/user/:id', function(req, res){
		var id = req.params.id;
		console.log(id);
		User.findById(id, function(err, info){
			if (err)
				throw err;
			var user = new Object();
			user.register = info.register;
			user.avatar = info[user.register].avatar;
			user.name = info[user.register].name;
			user.email = info[user.register].email;
			res.send(user);
		});
	});

	//logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('#');
	});

	//login message flash
	app.get('/login', function(req, res) {
		res.send({ 
			message: req.flash('loginMessage')
		});
	});

	//login authentication
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '#/sign-in', // redirect to the secure profile section
		failureRedirect : '#/sign-in', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	//register message flash
	app.get('/signup', function(req, res) {	
		var message = { message: req.flash('signupMessage') };
		res.send(message);
	});

	//register authentication
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '#', // redirect to the secure profile section
		failureRedirect : '#/sign-up', // redirect back to the signup page if there is an error
		failureFlash : true  // allow flash messages
	}));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('#');
}

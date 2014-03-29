module.exports = function(app, passport) {
	//facebook
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/#/',
			failureRedirect : '/#/'
		}));
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

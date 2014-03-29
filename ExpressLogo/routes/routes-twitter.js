module.exports = function(app, passport) {

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', 
		passport.authenticate('twitter', {
			successRedirect: '/#/',
			failureRedirect: '/#/'
		}));
};

function isLoggedIn(req, res, next) {
	if (req.inAuthenticated())
		return next();
	res.redirect('/');
}
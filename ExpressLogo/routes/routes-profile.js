module.exports = function(app){
	var User = require('../models/user');
	var Post = require('../models/post');

	app.get('/profile', function(req, res){
		if(!req.user)
			res.redirect('#');
		else{
			var user = req.user;

			User.findById(user._id, function(err, info){
				if(err)
					throw err;
				Post.findById(user._id, function(err, post){
					if (err)
						throw err;
			 		res.send({
			 			user: info,
			 			post: post
			 		});
 				});
			});
		}
	});

	app.get('/account', function(req, res){
		if(!req.user)
			res.redirect('#');
		else{
			var user = req.user;

			if (user.register == 'local'){
				User.findById(user._id, function(err, info){
					if (err)
						throw err;
					res.send(info);
				});
			}
		}
	});

	app.post('/account/update', function(req, res){
		if (!req.user)
			res.redirect('#');
		else{
			var user = req.user;
			var reg = user.register;
			var name = user[reg].name;
			var obj = req.body.name;
			console.log(obj);
			console.log(name);

			User.findByIdAndUpdate(user._id, {
				$set : {'local.name' : obj}
			}, function(err, User){
				if(err)
					throw err;
			});

			res.redirect('/#/account');
		}
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send({ message : 'not logged in'});
}

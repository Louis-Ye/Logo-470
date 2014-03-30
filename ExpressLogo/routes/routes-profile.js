module.exports = function(app){
	var User = require('../models/user');
	var Post = require('../models/post');

	app.get('/profile', function(req, res){
		if(!req.user)
			res.redirect('#');
		else{
			var user = req.user;
			var reg = user.register;
			var name = user[reg].name;

			Post.findById(user._id, function(err, post){
				if (err)
					throw err;
				res.send(post);
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
};
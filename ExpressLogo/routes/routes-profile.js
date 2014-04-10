var async = require("async");

module.exports = function(app){
	var User = require('../models/user');
	var Post = require('../models/post');

	app.get('/profile', function(req, res){
		if(!req.user)
			res.send({ message : 'not logged in'});
		else{

			var user = req.user;
			var reg = req.user.register;
			var user_info = {
				name: user[reg].name,
				avatar: user[reg].avatar,
				email: user[reg].email
			};
			var query = { 'author.id': user._id };
			Post.find(query, function(err, post){
				if (err)
					throw err;
				if(isEmptyObject(post)){
					res.send({
			 		'user': user_info,
			 		'post': post, 
			 		'message': "null"
			 		});
				}
				else{
					res.send({
			 		'user': user_info,
			 		'post': post, 
			 		'message': "success"
			 		});
				}
 			});
			
		}
	});

	app.get('/account', isLoggedIn, function(req, res){
		var user = req.user;

		if (user.register == 'local'){
			User.findById(user._id, function(err, info){
				if (err)
					throw err;
				res.send({ user: info, message: "local_success"});
			});
		}
		else{
			res.send({ message: "logged with social account"});
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
			//console.log(obj);
			//console.log(name);

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

function isEmptyObject(obj) {
	for (var name in obj) 
    {
        return false;
    }
    return true;
}

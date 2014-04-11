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

			User.findByIdAndUpdate(user._id, {
				$set : {'local.name' : obj}
			}, function(err, User){
				if(err)
					throw err;
			});

			res.redirect('/#/account');
		}
	});

	app.get('/account/change-password', function(req, res){
		var pwdMessage = { pwdMessage: req.flash('pwdMessage')};
		res.send(pwdMessage);
	});

	app.post('/account/change-password', function(req, res){
		if(!req.user)
			req.redirect('#');
		else{
			var user = req.user;
			var oldpwd = req.body.old_password;
			var newpwd = req.body.new_password;
			var confirm = req.body.confirm_password;

			if (!user.validPassword(oldpwd)){
				req.flash('pwdMessage', '');
				req.flash('pwdMessage' , 'Wrong password. Try again!');
				res.redirect('/#/account');
			} 
			else {
				if (confirm != newpwd){
					req.flash('pwdMessage', '');
					req.flash('pwdMessage' , 'Confirm password and new password are not match!');
					res.redirect('/#/account');
				}
				else {
					User.findByIdAndUpdate(user._id, {
						$set : {'local.password' : user.generateHash(newpwd)}
					}, function(err, User){
						if(err)
							throw err;
					});
					req.flash('pwdMessage', '');
					req.flash('pwdMessage' , 'Success');
					res.redirect('/#/account');
				}
			}
		}
	})
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

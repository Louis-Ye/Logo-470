var async = require("async");

module.exports = function(app) {
	var User = require('../models/user');
	var Post = require('../models/post');

	app.get('/notification', function(req, res){
		var user = req.user;

		var q = req.query.q;
		console.log(q);
		if(q == "like"){
			User.findById(user._id, { sort: {'notification.like.data': -1} }, function(err, user){
				console.log(user);
				res.send(user);
			});
		}
		if(q == "comment"){
			User.findById(user._id, function(err, user){
				res.send(user.notification.comment);
			});
		}
		if(q == "all"){
			User.findById(user._id, function(err, user){
				res.send(user.notification.comment);
			});
		}
	});
};
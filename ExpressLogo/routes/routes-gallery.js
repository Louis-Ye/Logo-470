//gallery oprations
module.exports = function(app) {
	var Post = require('../models/post');

	app.post('/share', function(req, res){
		//console.log(req.body);
		if(!req.user){
			res.send({ message: "not logged in"});
		}
		else {
			var user = req.user;
			var register = req.user.register;
			//console.log(user);
			var newpost = new Post({
				author : {
					id: user._id,
					name: user[register].name,
					avatar: user[register].avatar
				},
				create_at : Date.now(),
				code : req.body.code,
				image_url : req.body.img_url
			});
			//console.log(newpost);
			newpost.save(function(err) {
        		if (err)
          			throw err;
    		});
    		res.send({ message : "success"});
		}	
	});	

	app.post('/gallery/:id/comments', function(req, res){
		leave a comment
		if(!req.user){
			res.send({ message: "not logged in"});
		}
		else {
			var post_id = req.params.id;
			var user = req.user;
			var register = req.user.register;
			var new_comment = {
				content: req.body.content,
				data: Date.now,
				author: {
					id: user._id, 
					name: user[register].name,
					avatar: user[register].avatar
				}
			};
			Post.findByIdAndUpate(post_id, { $push: {
				comment: new_comment
			} }, function(err, data){
				if(err) 
					res.send({
						message: err
					});
				else res.send({ 
					message: "success"
				});
			});
		}
	});

	app.post('/gallery/:id/like', isLoggedIn, function(req, res){
		//like this post
		var post_id = req.params.id;
			Post.findByIdAndUpate(post_id, { $inc: { like : 1 }}, function(err, data){
			if(err) 
					res.send({
						message: err
					});
				else res.send({ 
					message: "success"
				});
			});
	});

	//get the details of one share
	app.get('/gallery/:id', function(req, res){
		var post_id = req.params.id;
		Post.findById(post_id, function(err, data){
			res.send(data);
		});
	});
	
	//list all the posts
	//with pagination
	app.get('/gallery', function(req, res){
		var page_num = req.query.page;
		var page_num = req.query.sort;
		var item_per_page = 10;
		Post.find({}, null, { skip: item_per_page*(page_num-1), limit: item_per_page }, function(err, data){
			if(err)
				throw err;
			Post.count({}, function(err, count){
				res.send({
					count: count, 
					post: data
				});
			});
		});
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send({ message: "not logged in" });
}
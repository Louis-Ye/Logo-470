var async = require("async");

//gallery oprations
module.exports = function(app) {
	var Post = require('../models/post');
	var User = require('../models/user');

	//share a post(login first)
	app.post('/share', function(req, res){
		if(!req.user){
			res.send({ message: "not logged in"});
		}
		else {
			var user = req.user;
			var register = req.user.register;
			var newpost = new Post({
				author : {
					id: user._id,
					name: user[register].name,
					avatar: user[register].avatar
				},
				create_at : Date.now(),
				code : req.body.code,
				image_url : req.body.img_url,
				like : 0
			});
			newpost.save(function(err) {
        		if (err)
          			throw err;
    		});
    		res.send({ message : "success"});
		}	
	});	

	//leave a comment
	app.post('/gallery/:id/comments', function(req, res){
		if(!req.user){
			res.send({ message: "not logged in"});
		}
		else {
			var post_id = req.params.id;
			var user = req.user;
			var register = req.user.register;
			var message;
			var new_comment = {
				content: req.body.co,
				date: Date.now(),
				author: {
					id: user._id, 
					name: user[register].name,
					avatar: user[register].avatar
				}
			};
			var notification = {
				isRead: false,
				postId: post_id,
				content: req.body.co,
				date: Date.now(),
				author: {
					id: user._id, 
					name: user[register].name,
					avatar: user[register].avatar
				}

			};
			Post.findByIdAndUpdate(post_id, { $push: {
				comment: new_comment
			} }, function(err, data){
				if(err){
					throw err;
				}	
				else {
					var post_author_id = data.author.id;
					User.findByIdAndUpdate(post_author_id, { $push: { 'notification.comment': notification }}, function(err, data){
        			});
				}	
			});
			// Post.findByIdAndUpdate(post_id, { $push: {
			// 	comment: new_comment
			// } }, function(err, data){
			// 	if(err) 
			// 		res.send({
			// 			message: err
			// 		});
			// 	else res.send({ 
			// 		message: "success"
			// 	});
			// });
		}
	});

	//like a post
	app.post('/gallery/:id/like', isLoggedIn, function(req, res){
		//one user can only like a post once
		var user = req.user;
		var register = req.user.register;
		var post_id = req.params.id;
		var new_liker = {
			id: user._id,
			name: user[register].name,
			avatar: user[register].avatar
		};
		var message;
		var like_notification = {
			postId: post_id,
			liker: new_liker,
			date : Date.now()
		};
		async.parallel([
			function(callback){
				Post.find({ _id: post_id }, function(err, doc){
					callback(null, doc);
				});
			}
		],
		function(err, result){
			//doc stored as result[0]
			var isLiked = false;
			var post_author_id = result[0][0].author.id;
			for (var i in result[0][0].likers){
				if(result[0][0].likers[i].id == new_liker.id){
					isLiked = true;
				}
			}
			if(isLiked){
				res.send({ message: "already liked this post"});
			}
			else {
				Post.findByIdAndUpdate(post_id, { $inc: { like: 1 }, $push: { likers: new_liker }}, function(err, data){

				});
				User.findByIdAndUpdate(post_author_id, { $push: { 'notification.like': like_notification }}, function(err, data){
   	    		});
   	    		/*save method may lead to crash*/
				// Post.findById(post_id, function(err, data){
				// 	if(err) {
				// 		message = "err";
				// 		res.send({ message: err });
				// 	}
				// 	else {
				// 		data.like = data.like +1;
				// 		data.likers.push(new_liker);
				// 		data.save(function(err, doc){
				// 			if(err) res.send({ message: err });
				// 			else{
				// 				res.send({ message: "success" });
				// 			}
				// 		})
				// 	}
				// });
			}
		});
		/*not check repeat likes*/
		// Post.findByIdAndUpdate(post_id, { $inc: { like : 1 }}, function(err, data){
		// 	if(err) 
		// 		res.send({
		// 			message: err
		// 		});
		// 	else res.send({ 
		// 		message: "success"
		// 	});
		// });
	});

	//get the details of one share
	app.get('/gallery/:id', function(req, res){
		var post_id = req.params.id;
		Post.findById(post_id, function(err, data){
			if(isEmptyObject(data)){
				res.send({ message: "failed"});
			}
			else {
				res.send(data);
			}
		});
	});
	
	//list all the posts
	app.get('/gallery', function(req, res){
		var page_num = req.query.page;
		var page_num = req.query.sort;
		/*
		* with pagination
		*/
		//var item_per_page = 10;
		// Post.find({}, null, { skip: item_per_page*(page_num-1), limit: item_per_page }, function(err, data){
		// 	if(err)
		// 		throw err;
		// 	Post.count({}, function(err, count){
		// 		res.send({
		// 			count: count, 
		// 			post: data
		// 		});
		// 	});
		// });
	
		/*
		* without pagination
		*/
		async.parallel({
			count: function(callback){
				Post.count({}, function(err, count){
					callback(null, count);
				});
			},
			post: function(callback){
				Post.find({}, function(err, post){
					var send_post = new Array;
					for(var i in post){
						var one_post = {
							image_url: post[i].image_url,
							like: post[i].like,
							_id: post[i]._id,
							author: post[i].author
						}
						send_post.push(one_post);
					}
					callback(null, send_post);
				});
			}
		},
		function(err, result){
			res.send(result);
		});
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send({ message: "not logged in" });
}

function isEmptyObject(obj) {
	for (var name in obj) 
    {
        return false;
    }
    return true;
}
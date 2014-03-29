module.exports = function(app) {
	var Post = require('../models/post');

	app.get('/addpost', function(req, res){
		if(!req.user){
			res.redirect("/");
		}
		else {
			var user = req.user;
			var register = user.register;
			//for example
			var newpost = new Post({
				author : {
					id: user._id,
					name: user[register].name,
					avatar: user[register].avatar,
				},
				date : Date.now(),
				image :0000,
				code : "fd 10",
			});
			newpost.save(function(err) {
        	if (err)
          	throw err;
    		});
    	res.json(newpost);
		}	
	});

	//simply list all the posts
	app.get('/gallery', function(req, res){
		Post.find(function(err, post){
			if(err)
				throw err;
			res.send(post);
		});
	});
};
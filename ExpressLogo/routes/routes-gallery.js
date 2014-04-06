//gallery oprations
module.exports = function(app) {
	var Post = require('../models/post');

	app.post('/share', function(req, res){
		console.log(req.body);
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
		//leave a comment
	});

	//list all the posts
	app.get('/gallery', function(req, res){
		Post.find(function(err, data){
			if(err)
				throw err;
			var post = new Object();
			post = data;
			
			res.send(post);
		});
	});
};
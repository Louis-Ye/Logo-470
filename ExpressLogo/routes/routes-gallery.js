var fs = require('fs');

module.exports = function(app) {
	var Post = require('../models/post');

	app.get('/addpost', function(req, res){
		if(!req.user){
			res.redirect("/");
		}
		else {
			var user = req.user;
			var register = user.register;

			//for test
			var newpost = new Post({
				author : {
					id: user._id,
					name: user[register].name,
					avatar: user[register].avatar,
				},
				date : Date.now(),
				code : "some codes",
			});
			newpost.image = fs.readFileSync('./turtle.png').toString('base64');
			//use the followting code to show the pic
			//<img src="data:image/png;base64, <%= data %>"/>
			//console.log(newpost.image);
			newpost.save(function(err) {
        		if (err)
          			throw err;
    		});
    		res.render("img", {data: newpost.image});
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
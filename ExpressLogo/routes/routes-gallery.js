//gallery oprations
module.exports = function(app) {
	var Post = require('../models/post');

	app.post('/share', function(req, res){
		if(!req.user){
			res.redirect("#");
		}
		else {
			var user = req.user;
			var register = user.register;

			//for test
			var newpost = new Post({
				author : {
					id: user._id,
				},
				date : Date.now(),
				code : req.body.code,
				image_url : req.body.img
			});
			//newpost.image = fs.readFileSync('./turtle.png').toString('base64');
			//use the followting code to show the pic
			//<img src="data:image/png;base64, <%= data %>"/>
			newpost.save(function(err) {
        		if (err)
          			throw err;
    		});
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
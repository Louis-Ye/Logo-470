// require packages
var mongoose = require('mongoose');
//to generate url-friendly _id
var shortId = require('shortid');

var postSchema = mongoose.Schema({
	_id: {
    	type: String,
    	unique: true,
    	default: function(){ return shortId.generate(); }
	},
	title : String,
	author : {
		id: String, 
		name: String, 
		avatar: String
	},
	create_at : Date,
	image_url : String,
	code : String,
	like : Number,
	likers : [{
		id: String, 
		name: String,
		avatar: String
	}],
	comment : [{
		_id: {
    	type: String,
    	unique: true,
    	default: function(){ return shortId.generate(); }
		},
		author: {
			id: String, 
			name: String,
			avatar: String
		},
		content: String,
		date: Date,
	}]
});

module.exports = mongoose.model('Post', postSchema);
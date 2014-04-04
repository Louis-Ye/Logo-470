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
		id: String
	},
	create_at : Date,
	image : Buffer,
	code : String,
	comment : [{
		author: {
			id: String
		},
		content: String,
		date: Date,
	}]
});

module.exports = mongoose.model('Post', postSchema);
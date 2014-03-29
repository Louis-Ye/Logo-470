var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	author : {
		id: String,
		name: String,
		avatar: String,
	},
	date : Date,
	image : Buffer,
	code : String,
	comment : [{
		author: {
			id: String,
			name: String,
			avatar: String,
		},
		content: String,
		date: Date,
	}]
});

module.exports = mongoose.model('Post', postSchema);
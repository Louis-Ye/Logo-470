// require packages
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//to generate url-friendly _id
var shortId = require('shortid');

// define the schema for our user model
var userSchema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        default: function(){ return shortId.generate(); }
    },
    register : String,
    local            : {
        email        : String,
        name         : String,
        password     : String,
        avatar       : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        avatar       : String
    },
    twitter          : {
        id           : String,
        token        : String,
        username     : String,
        name         : String,
        avatar       : String
    },
    notification     : {
        like         : [{
            postId   : String,
            liker    : {
                id: String, 
                name: String,
                avatar: String
            },
            date     : Date
        }],
        comment      : [{
            isRead   : Boolean,
            postId   : String,
            content  : String,
            author   : {
                id: String, 
                name: String,
                avatar: String
            },
            date     : Date
        }]
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);

var mongoose 	= require('mongoose')
  , Schema   	= mongoose.Schema
  , Mixed    	= Schema.Types.Mixed
  , ObjectId 	= Schema.ObjectId;

var Page = new Schema({
    title       : String,
    slug        : String,
    template    : String,
    data        : Object
});

Page.pre('save', function (next) {
    // Do something.
    next();
});

module.exports.PageSchema = Page;

var Post = new Schema({
    slug       : String,
	title	   : String,
	content	   : String,
	author	   : String,
    img        : String,
    next       : Object,
    prev       : Object,
	timestamp  : Date
});

Post.pre('save', function (next) {
    // Do something.
    next();
});

module.exports.PostSchema = Post;

var Author = new Schema({
	name	   	 : String,
	social_media : Array
});

Author.pre('save', function (next) {
    // Do something.
    next();
});

module.exports.AuthorSchema = Author;

var User = new Schema({
    username    : String,
    password    : String,
    permissions : Boolean
});

User.pre('save', function (next) {
    // Do something.
    next();
});

module.exports.UserSchema = User;
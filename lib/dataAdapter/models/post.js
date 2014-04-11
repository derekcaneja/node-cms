var  mongoose   = require('mongoose')
  ,  PostSchema = require('./schemas').PostSchema
  ,  _          = require('underscore');

PostSchema.statics.get = function(req, api, callback) {
    var slug = req.param('slug');

    if(slug) {
        this.findOne({ slug: slug }, function(err, post) {
            if(err) callback('Page does not exist!');
            else    callback(null, post);
        });
    } else callback('Page does not exist!');
};

PostSchema.statics.post = function(req, api, callback) {
    var params = req.body || {};

    var newPost = new this(params);

    newPost.save(function(err) {
        
        console.log('new post saved', newPost);
        
        callback(err);
    });
};

PostSchema.statics.put = function(req, api, callback) {  
    var id = (req.param('id')) ? req.param('id') : callback('Cannot update without id');

    var data    = _.pick(req.body, ['title', 'body']);
    var options = {};

    this.update({ _id: id }, data, options, callback);
};

PostSchema.statics.del = function(req, api, callback) {
    var id = (req.param('id')) ? req.param('id') : callback('Cannot delete without id');

    this.update({ _id: id }, { del: true }, callback);
};

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
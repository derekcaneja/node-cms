var config   = require('../../config.json')
  , fs       = require('fs')
  , mongoose = require('mongoose')
  , bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
    app.get('/', function(req, res){
        var postSchema = mongoose.model('Post');

        postSchema.find(function(err, posts){
            var postPreviews = [];
            
            for(var i = 0; i < Math.min(posts.length, 3); i++) postPreviews.push(posts[i].toObject());

            res.render('index', { title: config.json, post_previews: postPreviews }, function(err, html) {
                res.type('html').end(html);
            });
        }); 
    });

    app.get('/admin_signin', function(req, res){       
        res.render(__dirname + '/views/admin_signin.hbs', { layout: __dirname + '/views/__layout.hbs' }, function(err, html) {
            res.type('html').end(html)
        });
    });

	app.get('/admin', function(req, res){      
        if(!req.session.user) res.redirect('/admin_signin');
        else {
    		res.render(__dirname + '/views/admin.hbs', { layout: __dirname + '/views/__layout.hbs', user: req.session.user }, function(err, html) {
                res.type('html').end(html)
            });
        }
    });

    app.get('/admin_settings', function(req, res){      
        if(!req.session.user) res.redirect('/admin_signin');
        else {
            res.render(__dirname + '/views/admin_settings.hbs', { layout: __dirname + '/views/__layout.hbs', config: config }, function(err, html) {
                res.type('html').end(html)
            });
        }
    });

    app.get('/admin_pages', function(req, res){   
        var pageSchema = mongoose.model('Page');
      
        if(!req.session.user) res.redirect('/admin_signin');
        else {
            pageSchema.find(function(err, pages) {
                console.log(pages)
                res.render(__dirname + '/views/admin_pages.hbs', { layout: __dirname + '/views/__layout.hbs', pages: pages }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_posts', function(req, res){   
        var postSchema = mongoose.model('Post');
      
        if(!req.session.user) res.redirect('/admin_signin');
        else {
            postSchema.find(function(err, posts) {
                res.render(__dirname + '/views/admin_posts.hbs', { layout: __dirname + '/views/__layout.hbs', posts: posts }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_authors', function(req, res){   
        var authorSchema = mongoose.model('Author');
      
        if(!req.session.user) res.redirect('/admin_signin');
        else {
            authorSchema.find(function(err, authors) {
                res.render(__dirname + '/views/admin_authors.hbs', { layout: __dirname + '/views/__layout.hbs', authors: authors }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_edit_page', function(req, res){
        var pageSchema = mongoose.model('Page');

        if(!req.session.user) res.redirect('/admin_signin');
        else {

            pageSchema.findOne({ _id: req.param('id') }, function(err, page) {
                fs.readdir(app.get('views'), function(err, templates){

                    var finalTemplates = [];

                    for(var i = 0; i < templates.length; i++) if(templates[i].substring(0, 1) != '_') finalTemplates.push({ name: templates[i].substring(0, templates[i].length -4) });
                    
                    res.render(__dirname + '/views/admin_new_page.hbs', { layout: __dirname + '/views/__layout.hbs', page: page, templates: finalTemplates }, function(err, html) {
                        res.type('html').end(html)
                    });
                });
            });
        }
    });

    app.get('/admin_new_page', function(req, res){
        if(!req.session.user) res.redirect('/admin_signin');
        else {
            fs.readdir(app.get('views'), function(err, templates){

                var finalTemplates = [];

                for(var i = 0; i < templates.length; i++) if(templates[i].substring(0, 1) != '_') finalTemplates.push({ name: templates[i].substring(0, templates[i].length -4) });
                
                res.render(__dirname + '/views/admin_new_page.hbs', { layout: __dirname + '/views/__layout.hbs', templates: finalTemplates }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_new_post', function(req, res){
        var authorSchema = mongoose.model('Author');

        if(!req.session.user) res.redirect('/admin_signin');
        else {
            authorSchema.find(function(err, authors) {
                res.render(__dirname + '/views/admin_new_post.hbs', { layout: __dirname + '/views/__layout.hbs', authors: authors }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_edit_post', function(req, res){
        var postSchema = mongoose.model('Post');

        if(!req.session.user) res.redirect('/admin_signin');
        else {
            postSchema.findOne({ _id: req.param('id') }, function(err, post) {
                res.render(__dirname + '/views/admin_new_post.hbs', { layout: __dirname + '/views/__layout.hbs', post: post }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.get('/admin_new_author', function(req, res){   
        if(!req.session.user) res.redirect('/admin_signin');
        else {    
            res.render(__dirname + '/views/admin_new_author.hbs', { layout: __dirname + '/views/__layout.hbs' }, function(err, html) {
                res.type('html').end(html)
            });
        }
    });

    app.get('/admin_edit_author', function(req, res){   
        var authorSchema = mongoose.model('Author');

        if(!req.session.user) res.redirect('/admin_signin');
        else {
            authorSchema.findOne({ _id: req.param('id') }, function(err, author) {
                res.render(__dirname + '/views/admin_new_author.hbs', { layout: __dirname + '/views/__layout.hbs', author: author }, function(err, html) {
                    res.type('html').end(html)
                });
            });
        }
    });

    app.post('/admin_attempt_signin', function(req, res) {
        var userSchema = mongoose.model('User');

        var username = req.param('username');
        var password = req.param('password');

        userSchema.findOne({ username: username }, function(err, result) {
            if(err) res.redirect('/admin_signin');
            else if(result && result.password == password) {
                // bcrypt.compare(user.password, password, function(err, result) {
                //     if     (err)    res.redirect('/admin_signin');
                //     else if(result) {
                        req.session.user = result;

                        res.send(200)
                //     }
                // });
            }
        });
    });

    app.get('/admin_attempt_signout', function(req, res) {
    	req.session.user = false;
    	res.redirect('/admin_signin')
    });

    app.post('/admin_attempt_save_post', function(req, res){  
        var postSchema = mongoose.model('Post');

        var id = req.param('id');

        if(id) {
            postSchema.findOne({ _id: id }, function(err, post) {
                post.slug    = req.param('slug');
                post.title   = req.param('title');
                post.content = req.param('content');
                post.author  = req.param('author');                    
                post.img     = req.param('img');
                
                post.save(function(err) {
                    res.send(200);
                });
            });
        } else {
            postSchema.find(function(err, posts) {
                var prev = posts[0];

                for(var i = 1; i < posts.length; i++) if(posts[i].timestamp > prev.timestamp) prev = posts[i];

                var params = {
                    slug      : req.param('slug'),
                    title     : req.param('title'),
                    content   : req.param('content'),
                    author    : req.param('author'),
                    img       : req.param('img'),
                    next      : null,
                    prev      : (prev) ? prev.toObject() : null,
                    timestamp : new Date() 
                };
                
                var newPost = new postSchema(params);

                if(prev) {
                    prev.next = params;

                    prev.save(function(err) {
                        newPost.save(function(err) {                
                            res.send(200);
                        });
                    });
                    
                } else {
                    newPost.save(function(err) {
                        res.send(200)
                    });
                }
            });  
        } 
    });

    app.post('/admin_attempt_save_author', function(req, res){
        var authorSchema = mongoose.model('Author');

        var id = req.param('id');

        if(id) {
            authorSchema.findOne({ _id: id }, function(err, author){
                author.name         = req.param('name');
                author.social_media = req.param('social_media');

                author.save(function(err) {
                    res.send(200);
                });
            });
        } else {
            var params = {
                name         : req.param('name'),
                social_media : req.param('social_media')
            };

            var newAuthor    = new authorSchema(params);

            newAuthor.save(function(err) {
                res.send(200)
            });
        }
    });

    app.post('/admin_attempt_save_page', function(req, res){
        var pageSchema = mongoose.model('Page');

        var id = req.param('id');

        if(id) {
            pageSchema.findOne({ _id: id }, function(err, page){
                page.title    = req.param('title');
                page.slug     = req.param('slug');
                page.template = req.param('template');
                page.data     = req.param('data');

                page.save(function(err) {
                    res.send(200);
                });
            });
        } else {
            var params = {
                title    : req.param('title'),
                slug     : req.param('slug'),
                template : req.param('template'),
                data     : req.param('data')
            };

            var newPage = new pageSchema(params);

            newPage.save(function(err) {
                res.send(200)
            });
        }
    });

    app.post('/save_settings', function(req, res){       
         var data = {
            title        : req.param('title'), 
            contact      : req.param('contact'), 
            url          : req.param('url'),  
            urlSchema    : req.param('urlSchema'), 
            social_media : req.param('social_media'), 
            database     : req.param('database'),
            user         : 'admin',
            pass         : 'password'
        };

        config = data;

        var toWrite = JSON.stringify(config, null, 4);

        fs.writeFile(__dirname + '../../../config.json', toWrite, function(err){
            res.send(200);
        });
    });

    app.get('/admin_delete_page', function(req, res){       
        var pageSchema = mongoose.model('Page');

        var id = req.param('id');

        pageSchema.findOne({ _id: id }, function(err, page) {
            page.remove();
            res.redirect('/admin_pages');
        });
    });

    app.get('/admin_delete_post', function(req, res){
        var postSchema = mongoose.model('Post');

        var id = req.param('id');

        postSchema.findOne({ _id: id }, function(err, post) {
            var prevID = (post.prev) ? post.prev.id : null;
            var nextID = (post.next) ? post.next.id : null;

            if(prevID && nextID) {
                postSchema.findOne({ _id: prevID }, function(err, prevPost) {
                    postSchema.findOne({ _id: nextID }, function(err, nextPost) {
                        prevPost.next = nextPost.toObject();
                        nextPost.prev = prevPost.toObject();

                        prevPost.save(function(err) {
                            nextPost.save(function(err) {
                                post.remove();
                                res.redirect('/admin_posts');
                            });
                        });
                    });
                });
            } else if(prevID || nextID) {
                postSchema.findOne({ _id: prevID || nextID }, function(err, result) {
                    if     (prevID) result.next = post.next;
                    else if(nextID) result.prev = post.prev;

                    result.save(function(err){
                        post.remove();
                        res.redirect('/admin_posts');
                    });
                });
            } else {
                post.remove();
                res.redirect('/admin_posts');
            }
        });
    });

    app.get('/admin_delete_author', function(req, res){       
        var authorSchema = mongoose.model('Author');

        var id = req.param('id');

        authorSchema.findOne({ _id: id }, function(err, author) {
            author.remove();
            res.redirect('/admin_authors');
        });
    });

    app.get('/admin_get_template_properties', function(req, res){       
        var template = req.param('template');

        fs.readFile(app.get('views') + '/' + template + '.hbs', 'utf8', function(err, html){

            var properties = [];

            var props = html.split('{{');

            for(var i = 0; i < props.length; i++) {
                props[i] = props[i].split('}}');

                if(props[i][0].indexOf('<') == -1 && props[i][0].length > 0) properties.push(props[i][0]);
            }

            res.send({ properties: properties });
        });
    });
}
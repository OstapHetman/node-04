var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
var uploads = multer({ dest: './public/images/uploads' });

router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findById(req.params.id, function(err, post) {
        res.render('show', {
            "post": post
        });
    });
});

router.get('/add', function(req, res, next) {
    var categories = db.get('categories');

    categories.find({}, {}, function(err, categories) {
        res.render('addpost', {
            "title": "Add Post",
            "categories": categories
        });
    });

});

router.post('/add', uploads.single('mainimage'), function(req, res, next) {
    // Get Form Values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if (req.files && req.files.mainimage) {
        var mainImageOriginalName = req.files.mainimage.originalmane;
        var mainImageName = req.files.mainimage.name;
        var mainImageMime = req.files.mainimage.mimetype;
        var mainImagePath = req.files.mainimage.path;
        var mainImageExt = req.files.mainimage.extension;
        var mainImageSize = req.files.mainimage.size;

    } else {
        var mainImageName = 'noimage.png';
    }

    // Form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('title', 'Bodu field is required');

    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            "errors": errors,
            "title": title,
            "body": body
        });
    } else {
        var posts = db.get('posts');

        // Submit to DB

        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainImageName
        }, function(err, post) {
            if (err) {
                res.send('There was an assue submitting the post');
            } else {
                req.flash('succes', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
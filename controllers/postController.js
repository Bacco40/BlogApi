var Post = require('../model/post');
const { body,validationResult } = require('express-validator');
var async = require('async');
const { post } = require('../routes');

exports.index = function(req, res) {
    Post.find({isPublished: true}, 'title creator date_of_creation image_url')
    .sort({date_of_creation : -1})
    .limit(9)
    .populate({path:'creator', select: 'username' })
    .exec(function (err, posts) {
      if (err) { return res.json(err); }
      //Successful, so render
      return res.json({posts:posts});
    })
};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
    async.parallel({
        posts: function(callback) {
          Post.findById(req.params.id)
          .populate({path:'creator', select: 'username' })
          .populate({
            path:'comments',
            options: { sort: { 'date_of_creation': -1 } } ,
            populate: {path:'creator', select: 'username' }
          })
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return res.json(err); } // Error in API usage.
        if (results.posts==null) { // No results.
            var err = new Error('Post not found');
            err.status = 404;
            return res.json(err);
        }
        // Successful, so render.
        return res.json({ post: results.posts } );
    });
};

// Handle Post create on POST.
exports.post_create_post = [

    // Validate and sanitize fields.
    body('title').trim().isLength({ min: 1, max:50}).withMessage('Title must be specified, and must be maximum 50 character long.'),
    body('image_url').if(body('image_url').isLength({min: 1})).trim().isURL({ protocols: ['https'] }).withMessage('Image Url must be a https Url'),
    body('post').trim().isLength({ min: 1, max:20000}).withMessage('Post must be specified, and must be maximum 20000 character long.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors posts.
            return res.json({user: req.user, post: req.body, errors: errors.array() });
        }
        else {
            // Data from form is valid.
            var post = new Post(
                {
                    title: req.body.title,
                    image_url: req.body.image_url,
                    post: req.body.post,
                    creator: req.body.user
                });
            post.save(function (err) {
                if (err) { return res.json(err); }
                // Successful - redirect to new actor record.
                return res.json(post);
            });
        }
    }
];

// Handle Post delete.
exports.post_delete = function(req, res) {
    async.parallel({
        post: function(callback) {
            Post.findById(req.params.id)
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return res.json(err); }
        // Success
        else {
            Post.findByIdAndRemove(req.params.id, function deletePost(err) {
                if (err) { return res.json(err); }
                return res.json(true)
            })
        }
    });
};

// Display Post update form on GET.
exports.post_update_get = function(req, res) {
    // Get post for form.
    async.parallel({
        post: function(callback) {
            Post.findById(req.params.id).exec(callback);
        },
        }, function(err, results) {
            if (err) { return res.json(err); }
            if (results.post==null) { // No results.
                var err = new Error('Post not found');
                err.status = 404;
                return res.json(err);
            }
            // Success.
            return res.json({ title: 'Update Post', user:req.user, post: results.post });
        });
};

// Handle Post update on PUT.
exports.post_update_put = [

    // Validate and sanitize fields.
    body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),
    body('image_url').if(body('image_url').isLength({min: 1})).trim().isURL({ protocols: ['https'] }).withMessage('Image Url must be a https Url'),
    body('post').trim().isLength({ min: 1, max:20000}).withMessage('Post must be specified, and must be maximum 20000 character long.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors posts.
            return res.json({ errors: errors.array() });
        }
        else {
            // Data from form is valid.
            var post = new Post(
                {
                    title: req.body.title,
                    post: req.body.post,
                    image_url: req.body.image_url,
                    isPublished: req.body.isPublished,
                    _id: req.params.id
                });
            Post.findByIdAndUpdate(req.params.id, post, {}, function (err) {
                if (err) { return res.json(err); }
                // Successful - redirect to book detail page.
                return res.json(true);
            });
        }
    }
];

exports.post_publish_put = function(req, res) {
    var post = new Post(
        {
            isPublished: req.body.isPublic,
            _id: req.params.id
        });
    Post.findByIdAndUpdate(req.params.id, post, {}, function (err) {
        if (err) { return res.json(err); }
        return res.json(true);
    }); 
}
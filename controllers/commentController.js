var Comment = require('../model/comment');
var Post = require('../model/post');
var async = require('async');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');

// Handle Comment create on POST.
exports.comment_create_post = [

    // Validate and sanitize fields.
    body('comment').trim().isLength({ min: 1 }).escape().withMessage('Comment must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            Post.find({})
            .sort({date_of_creation : -1})
            .populate('creator')
            .populate('comments')
            .exec(function (err, posts) {
                if (err) { return res.json(err);}
                // There are errors. Render form again with sanitized values/errors posts.
                return res.json({errors: errors.array()});
            })
        }
        else {
            // Data from form is valid.
            var idComment = mongoose.Types.ObjectId();

            var comment = new Comment(
                {
                    _id: idComment,
                    comment: req.body.comment,
                    creator: req.body.user,
                    post_ref: req.params.id
                });
            comment.save(function (err) {
                if (err) { return res.json(err);}
                //Successful
                Post.findById(req.params.id, function(err, post) {
                    if (err) return res.json(err);
                    post.comments.push(comment);
                    post.save(function(err) {
                      if (err) { return res.send(err); }
                      return res.json(true);
                    })
                });
            })
        }
    }
];

// Handle Comment delete.
exports.comment_delete= function(req, res) {
    async.parallel({
        comment: function(callback) {
            Comment.findById(req.params.id)
              .exec(callback)
        },
    }, function(err, results) {
        if (err) { return res.json(err); }
        // Success
        else {
            Comment.findByIdAndRemove(req.params.id, function deleteComment(err,comment) {
                if (err) { return res.json(err); }
                //Successful
                Post.findById(results.comment.post_ref, function(err, post) {
                    if (err) return res.send(err);
                    post.comments.pull(comment);
                    post.save(function(err) {
                      if (err) { return res.send(err); }
                      return res.json(true);
                    })
                });
            })
        }
    });
};
var async = require('async');
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const User = require('../model/user');
const Post = require('../model/post');
const passport = require("passport");
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
    async.parallel({
        posts: function(callback) {
          Post.find({ 'creator': req.params.id })
          .populate({path:'creator', select: 'username' })
          .sort({date_of_creation : -1})
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return res.json(err); } // Error in API usage.
        if (results.posts==null) { // No results.
            var err = new Error('User has no posts');
            err.status = 404;
            return res.json(err);
        }
        // Successful, so render.
        return res.json({posts: results.posts} );
    });
};

// Handle User log in on POST.
exports.user_log_in_post = function(req, res, next) {
  passport.authenticate('local', {session: false}, (err, user) => {
    if (err || !user) {
      return res.json({
        post: err,
        user : user
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.json(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign({user}, 'this_is_the_jwt_secret');
      return res.json({user, token});
    });
  })(req, res);
};

// Handle User create on POST.
exports.user_create_post =[

    // Validate and sanitize fields.
    body('username', 'Username must not be empty, and can have max 20 characters.').trim().isLength({ min: 1 , max: 20 }).escape(),
    body('password', 'Password must be at least 8 character.').trim().isLength({ min: 8 }).escape(),
    body('confPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
    }),

     // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var password1='';
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) { 
                return res.json(err);
            }
            password1=hashedPassword;
            const user = new User({
                username: req.body.username,
                password: password1,
            })

            if (!errors.isEmpty()) {
              return res.json({ title: 'Sign Up', user:user , errors: errors.array() });
            }else{
                User.findOne({ 'username': req.body.username })
                .exec( function(err, found_username) {
                   if (err) { return res.json(err); }
        
                   if (found_username) {
                     const post = [{msg:'Username already taken'}];
                     // User username exists, redirect to its detail page.
                     return res.json({ title: 'Sign Up', user:user , errors: post });
                   }
                   else {
                    // Data from form is valid. Save user.
                    user.save(function (err) {
                        if (err) { return res.json(err); }
                        return res.json(true);
                        });
                   }
            })
            }
        })  
}];

exports.test = function(req, res) {
  return res.json(true);
}
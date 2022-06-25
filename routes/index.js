var express = require('express');
var router = express.Router();
const passport = require("passport");

// Require controller modules.
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');
var comment_controller = require('../controllers/commentController');

/// USER ROUTES ///

//Verify log //
router.get('/test', passport.authenticate('jwt', { session: false }), user_controller.test);

// POST request for creating User.
router.post('/signup', user_controller.user_create_post);

// POST request for log in User.
router.post('/login', user_controller.user_log_in_post);

// GET request for User dashboard.
router.get('/user/:id', passport.authenticate('jwt', { session: false }), user_controller.user_detail);

/// POST ROUTES ///

// GET home page.
router.get('/', post_controller.index);

// POST request for creating Post.
router.post('/post/create', passport.authenticate('jwt', { session: false }), post_controller.post_create_post);

// DELETE request to delete Post.
router.delete('/post/:id/delete', passport.authenticate('jwt', { session: false }), post_controller.post_delete);

// GET request to update Post.
router.get('/post/:id/update', passport.authenticate('jwt', { session: false }), post_controller.post_update_get);

// PUT request to update Post.
router.put('/post/:id/update', passport.authenticate('jwt', { session: false }), post_controller.post_update_put);

// GET request for one Post.
router.get('/post/:id', passport.authenticate('jwt', { session: false }), post_controller.post_detail);

// PUT request to publish Post.
router.put('/post/:id/publish', passport.authenticate('jwt', { session: false }), post_controller.post_publish_put);

/// COMMENT ROUTES ///

//POST request for creating Comment.
router.post('/comment/:id/create', passport.authenticate('jwt', { session: false }), comment_controller.comment_create_post);

// GET request to delete Comment.
router.delete('/comment/:id/delete', passport.authenticate('jwt', { session: false }), comment_controller.comment_delete);

module.exports = router;
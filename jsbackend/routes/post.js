
const express= require('express');
const {getPosts, createPost, getPostsByUser, postById, isPoster, deletePostById,
        updatePostById, postPhoto, singlePost, like, unlike, comment, uncomment} = require('../controller/post');
const {requireSignin} = require('../controller/auth');
const {userById} = require('../controller/user');
const {createPostValidator}= require('../validators/validate_fields')
const router= express.Router();
//using express router we can do request routing of get post or any other method
//kind of middleware using routes
router.get('/getPosts', getPosts);

//like and unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);
//comment and uncomment
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

//we need to validate the request before passing it to createPost method itself
//router.post('/createPost', postController.createPost);
//requireSignin methods validates signin by checking the token
router.post('/createPost/:userId', requireSignin, createPost, createPostValidator);
router.get('/getPostsByUser/:userId', requireSignin, getPostsByUser);
router.delete('/deletePostById/:postId', requireSignin, isPoster, deletePostById);
router.put('/updatePostById/:postId', requireSignin, isPoster, updatePostById);
//get post by postId
router.get("/post/:postId", singlePost);
//photo route
router.get("/post/photo/:postId", postPhoto);

//look for the param in the request. Call userById method if userId param exists in the request
//if any route contains userId then firstly app.js executes userById method
router.param("userId", userById);
router.param("postId", postById);

module.exports= router;


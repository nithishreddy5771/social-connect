
const express= require('express');
const {deleteUserIncludingPosts} = require("../controller/user");
const {requireSignin} = require('../controller/auth');
const {userById, allUsers, getSingleUser, updateUser, deleteUser, userPhoto, hasAuthorization,
        addFollowing, addFollower, removeFollowing, removeFollower, findPeople,
        getConversations, getMessage, sendMessage} = require('../controller/user');
const router= express.Router();
//using express router we can do request routing of get post or any other method
//kind of middleware using routes

//we need to update following list and followers list -- so 2 methods may be
router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/getAllUsers', allUsers); //get allUsers
//make it secure access by checking signin
router.get('/getSingleUser/:userId', requireSignin, getSingleUser); //get single user --path uri param
//to update the user given the userId -- we use put method for updation -- requires signin
router.put('/updateUser/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/deleteUser/:userId', requireSignin, hasAuthorization, deleteUser);
//delete user including posts
router.delete('/deleteUserIncludingPosts/:userId', requireSignin, deleteUserIncludingPosts);
//photo route
router.get("/user/photo/:userId", userPhoto);

//whom to follow
router.get("/user/findPeople/:userId", requireSignin, findPeople);

//rather than creating different paths as getSingleUser, updateUser and deleteUser
//we can have common url /user/:userId and methods get, put, delete represents the action of url

// Get conversations list
router.get('/user/conversation/:userId', requireSignin, getConversations);
// Get messages from conversations list
router.get('/user/conversation/message/:user1/:user2', requireSignin, getMessage);
// Post private message
router.post('/user/message/:userId', requireSignin, sendMessage);


//look for the param in the request. Call userById method if userId param exists in the request
//if any route contains userId then firstly app.js executes userById method
router.param("userId", userById);
module.exports= router;


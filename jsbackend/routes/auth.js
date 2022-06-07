
const express= require('express');

const {signup, signin, signout, forgotPassword, resetPassword, socialLogin} = require('../controller/auth');
const {userById} = require('../controller/user');
const {userSignUpValidator, passwordResetValidator}= require('../validators/validate_fields')
const router= express.Router();
//using express router we can do request routing of get post or any other method
//kind of middleware using routes

router.post('/signup', userSignUpValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout); //get request as we don't post anything while logging out.

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin);

//look for the param in the request. Call userById method if userId param exists in the request
//if any route contains userId then firstly app.js executes userById method
router.param("userId", userById);
module.exports= router;


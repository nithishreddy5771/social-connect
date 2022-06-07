
const dotenv = require('dotenv');
dotenv.config();

const jwt= require('jsonwebtoken');
const User= require('../models/user');
const expressJwt= require('express-jwt');
const _ = require("lodash");
const { sendEmail } = require("../helpers/helperMethods");
const logger = require("../logging/loggerConfig");


exports.signup = async (req, res) => {

    //we assume emails are unique and we use to find the duplicates users
    const userExists= await User.findOne({email: req.body.email});
    if(userExists) return res.status(400).json({
        error: "Email is already taken by some other user, please provide different email address"
    });

    //if not creating new user with passed email id
    const user = await new User(req.body);
    await user.save();
    logger.info("signed up successfully - message from winston");
    res.status(200).json({
        success: "successfully created the user",
        message: "please use same username and password to login"
    });
};  // end of signup method

exports.signin = (req, res) => {
    //find the user based on email -- we will get email and password as request
    //using object destructuring
    const {email, password}= req.body; //we expect to get email, password from req body
    //user find -- we get err or user as return from findOne, use them in callback function
    User.findOne({email}, (error, user) => {
        //if error or no user exists then
        if(error || !user)
        {
            logger.error("error while finding user in the database - message from winston");
            return res.status(401).json({
                error: "user with specified email doesn't exist in the database",
                message: "please signup/create new account "

            });
        }
        //if user is found, match email and password with those already in database
        //creating authenticate method in model and using it here
        if(!user.authenticate(password))
        {
            logger.error("incorrect password provided for signin - message from winston")
            return res.status(401).json({
                error: "password mismatch",
                message: "please enter the exact password corresponding the login email"
            })
        }
        //generate a token with user_id(email) and secret
        //creating token with jwt secret, _id (which will be generated uniquely in mongodb database)
        logger.info("signed in successfully - message from winston");
        const token = jwt.sign({_id: user._id, role: user.role }, process.env.JWT_SECRET);
        //persist the token as 'token_name' in cookie with expiry date
        res.cookie("token", token, {expire: new Date() +10000});//expire 10000 seconds from current time
        //return response with user and token to the front end
        const {_id, name, email, role}= user; //object destructuring
        return res.json({token, user: {_id, email, name, role}});


    }); // end of User.findOne

}; // end of signin method

exports.signout = (req, res) => {
    //to sign out we need to remove/delete the cookie we created while signing in
    logger.info("Successfully logged out - message from winston");
    res.clearCookie("token"); //there will be no cookie, so user will not be authenticated
    return res.json({message: "successfully logged out"});
    //if we hit from postman, it doesn't clear the cookie as we're not in client side front end
    //it doesn't make sense to hit from postman
}; // end of signout method


exports.requireSignin= expressJwt({
    secret: process.env.JWT_SECRET, //checking secret key
    algorithms: ["HS256"],
    userProperty: "auth", //here name of the property is auth
    //if the token is valid, express jwt appends the verified user_id in an auth key to req object
});

// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    //console.log("forgot password finding user with that email");
    const { email } = req.body;
    //console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (error, user) => {
        // if err or no user
        if (error || !user)
        {
            logger.error(" forgot password: email doesn't exist in the database- message from winston")
            return res.status("401").json({
                error: "User with that email does not exist!"
            });
        }
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, iss: "Social-Connect" }, process.env.JWT_SECRET);

        // email data
        const emailData = {
            from: "noreply@social-connect.com",
            to: email,
            subject: "Password Reset Instructions -- Social-Connect app",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (error, success) => {
            if (error) {
                return res.json({ message: error });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
}; //end of forgotPassword method

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (error, user) => {
        // if error or no user
        if (error || !user)
        {
            logger.error("error while resetting the password - message from winston");
            return res.status("401").json({
                error: "Invalid Link!"
            });
        }

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((error, result) => {
            if (error)
                return res.status(400).json({error: error});

            logger.error("password reset successful - message from winston");
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
}; // end of resetPassword method


//social login
exports.socialLogin = (req, res) => {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (error, user) => {
        if (error || !user)
        {
            // create a new user and login
            user = new User(req.body);
            req.profile = user;
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign({ _id: user._id, iss: "Social-Connect" }, process.env.JWT_SECRET);
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
        else
        {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign({ _id: user._id, iss: "Social-Connect" }, process.env.JWT_SECRET);
            res.cookie("token", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    });
};// end of socialLogin

//post validator
exports.createPostValidator = (req, res, next) => {
    // title
    req.checkBody('title', 'Write a title').notEmpty();
    req.checkBody('title', 'Title must be between 4 to 100 characters').isLength({
        min: 4,
        max: 100
    });
    // body
    req.checkBody('body', 'Write a body').notEmpty();
    req.checkBody('body', 'Body must be between 4 to 1000 characters').isLength({
        min: 4,
        max: 1000
    });

    //check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
}; // end of createPostValidator


//signup validator
exports.userSignUpValidator = (req, res, next) => {
    //name is not null and between 4 to 10 characters
    //console.log(JSON.stringify(req.body));
    //console.log(JSON.stringify(req.body.name));
    req.check("name", "name is required").notEmpty();
    //req.check("name", "name must contain at least 1 character").isLength({min:1});
    //email is not null
    req.check("email", "email shouldn't be null/ email is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        //meaning of below regex any character 1 or more times then @ then any character 1 or more times
        // then one dot then any character any no of times
        .matches(/.+@.+\..+/)
        .withMessage("Email must contain @, it should be {characters}@{characters}.{characters}")
        .isLength({
            min: 5,
            max: 2000
        })

    //checking password
    req.check("password", "password is required").notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage("password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("password must contain at least one number")

    //check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
}; // end of userSignUpValidator method

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error shows up the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
}; // end of passwordResetValidator

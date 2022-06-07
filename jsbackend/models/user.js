//creating user schema
//mongoose is required for creating Object Data Modeling
const mongoose= require('mongoose');
const uuidv1= require('uuidv1');
const crypto= require('crypto');
const {ObjectId}= mongoose.Schema;

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    salt: String, // salt is long randomly generated complicated string , used as secret in encryption
    created:{
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim: true
    },
    following: [{type: ObjectId, ref: "user_schema"}], //list with type and ref of that type
    followers: [{type: ObjectId, ref: "user_schema"}],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    }
});

//virtual field -- these fields are just to take input from the user -- won't be persisted to database
userSchema.virtual('password')
    .set(function(password){
        //create temporary variable _password
        this._password= password;
        //generate a time stamp
        this.salt= uuidv1();// this will give unique time stamp, we will pass it as secret key to encrypt
        //encrypt the password --user created encryptPassword() method
        this.hashed_password= this.encryptPassword(password);
    })
    .get(function (){
        return this._password;
    })

//adding methods to schema
userSchema.methods= {
    //authenticate method
    authenticate: function(plain_password_from_user)
    {
        //encrypt the password and then match with the hashed password in the database
        return this.encryptPassword(plain_password_from_user) === this.hashed_password;
    },

    //encrypt password method
    encryptPassword: function (password)
    {
        if(!password) return "";
        try
        {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }
        catch(error)
        {
            return ""; //return empty string if there is an error in the try block
        }
    }
} // end of addingSchema methods

module.exports = mongoose.model("user_schema", userSchema);
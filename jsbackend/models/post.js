const mongoose= require("mongoose");
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
        default: {}
    },
    postedBy:{
        type: ObjectId,
        ref: "user_schema"
    },
    created:{
        type: Date,
        default: Date.now()
    },
    update: Date,
    likes: [{type: ObjectId, ref: "user_schema"}], //list with type and ref of that type
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now()},
            postedBy: {type: ObjectId, ref: "user_schema"}
        }
    ]

});

//creating model with mongoose and naming it as post_schema and exporting it
//here model name is post_schema, we can create new post_schema object using it
//mongoose is Object Data Modeling b/w nodejs and mongoDB
module.exports= mongoose.model("post_schema", postSchema);


// load env variables
const dotenv = require('dotenv');
dotenv.config();
const express= require('express');
const app= express();
const morgan = require('morgan');
const postRoutes= require('./routes/post');
const authRoutes= require('./routes/auth');
const userRoutes= require('./routes/user');
const expressValidator= require('express-validator');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const mongoose = require('mongoose');
const fs= require('fs');
const cors= require('cors'); // we use this as middleware


//middleware using morgan
app.use(morgan("dev"));
//changing app.get to app.use as we're using router
app.use(bodyParser.json());//using bodyParser as middleware- now any incoming request with body parsed to json
app.use(cookieParser());
app.use(expressValidator());
//all the app.use statements should be before routes because we need to load add everything to app and then
//perform the routing of requests
app.use(cors());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

//api documentation
app.get("/", (req, res) => {

	//const file_data= JSON.parse(fs.readFileSync('./apiDocumentation/docs.json', 'utf-8'));
	//console.log("file data from readFileSync: "+ JSON.stringify(file_data));
	//use ./ for accessing folders at same level, directly mentioning '/' won't work
	fs.readFile('./apiDocumentation/docs.json', (error, data) => {
		if(error)
			res.status(400).json(error);

		//console.log("printing data from file: "+ data.toString());
		const parsed_file= JSON.parse(data);
		res.json(parsed_file);
	});
}); // end of displaying api documentation route



app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({
			error: "unauthorized access",
			message: "invalid token"
		});
	}
});

//const port= 3001
const server= app.listen(process.env.PORT, () => {
	console.log("A node js API is listening on port: "+ process.env.PORT)

});

//socket messaging
const io = require('socket.io')(server);

let users=[];
io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */

	const { id } = socket.client;
	console.log(`User connected: ${id}`)
	//When a user logs in store his user id and the socket id...
	socket.on('User_Connected',function(userId){
		users[userId]=socket.id;
		console.log('All Users',users);


	})

	socket.on("chat_message", (data) => {
		console.log('Inside the socket',data)
		//search for the socket id of the receiver
		console.log('Who is the receiver?',data.receiver)
		let socketId=users[data.receiver]
		//Now emit the recieved message to the receivers socket id
		io.to(socketId).emit('new_message',data)
	});

	socket.on('disconnect', function () {
		console.log('A user disconnected');

	});
});

// Assign socket object to every request
app.use(function (req, res, next) {
	req.io = io;
	next();
});



//console.log("MONGO URI IS " + process.env.MONGO_URI);
//console.log("Port number is: "+ process.env.PORT);

//db connection -- db name is "connectDB" if not already present, will be created
mongoose.connect(process.env.MONGO_URI,
	{useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('MongoDB Connected....'));

mongoose.connection.on('error', err => {
	console.log(`Mongo DB connection error: ${err.message}`)
});

module.exports= server;

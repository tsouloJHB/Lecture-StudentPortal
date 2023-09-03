// Import required modules
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDb = require('./db');
const UserRoute = require("./router/users");
const QuizRoute = require("./router/quiz");
const PortalRoute = require("./router/portal");
const GroupChatRoute = require("./router/groupChat");
const MessageRoute = require("./router/message");
const ResourcesRoute = require("./router/resources");
const groupChatController = require("./controllers/groupChat");
const {Server} = require('socket.io');
const fs = require('fs');
const pdf = require('pdf-parse');

dotenv.config();
connectDb();
const bodyParser = require('body-parser');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies for API requests
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const options = {
  cors:true,
  origin:['http://localhost:8080']
}


app.use('/users', UserRoute);
app.use('/quiz', QuizRoute);
app.use('/portal', PortalRoute);
app.use('/groupChat', GroupChatRoute);
app.use('/message', MessageRoute);
app.use('/resources', ResourcesRoute);

app.get('/', async(req, res) => {
   
    res.render('login');
  });
  

const PORT  = process.env.PORT;
const server =  app.listen(PORT,() => console.log('Listening on port 8080'));

const io = new Server(server,options);

let activeUsers = [];
io.on("connection",socket =>{
  console.log("someone connected");
  socket.on('message', message => console.log(message));

  socket.on("new-user-add", async (user) => {
    // if user is not added previously4
    let newUserId = user._id
    
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    const groupChatMembers = await groupChatController.getMembers(user.groupChat);

    // const filteredGroupChatMembers = groupChatMembers
    // .filter((member) =>
    //     activeUsers.some((activeUser) => activeUser.userId === member._id.toString())
    // )
    // .map((member) => member._id.toString());
    // console.log(filteredGroupChatMembers);
    const filteredActiveUsers = activeUsers.filter((activeUser) =>
    groupChatMembers.some((member) => activeUser.userId === member._id.toString())
    );

    // console.log(filteredActiveUsers);

    io.emit("get-users",filteredActiveUsers);

  });
  //the client will send a disconnect if the user closes the browser
  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    //io.emit("get-users", activeUsers);
    //remove user request
    io.emit("remove-user",socket.id);
  });

    //send message to multiple users
    socket.on("broadcast message", (data)=>{
    
      const {receiverIds} = data;
      console.log(data)
      receiverIds.forEach((id) => {
        const user = activeUsers.find((user) => user.userId === id);
        if(user){
          io.to(user.socketId).emit("receive-message",data.data);
        }
      });
      data = null;
    });

  socket.off("new-user-add",()=>{
    console.log("Socket cleaned");
    socket.leave(socket.id);
  });

});


module.exports = app;

// solve when a user disconnects tell the front end remove the user
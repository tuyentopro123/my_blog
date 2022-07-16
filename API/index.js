const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000

// Connect database
mongoose.connect(process.env.MONGODB_URL,
    (err) => {
        if(err) console.log(err) 
        else console.log("database is active");
       }
)


app.use(express.json({ limit: '50mb', extended: true }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser())

app.use(express.json());

require("./utils/passport");
app.use(cors({
  origin: "https://my-blog-ten-snowy.vercel.app/",
  credentials:true,
  optionSuccessStatus:200
}
)) 
app.use(session({
  secret: 'somethingsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2*24*60*60*1000},
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));
app.use(passport.authenticate("session"));

// app.use(resetCookieExprise)

// ROUTES
app.use("/v1/auth",authRoute);

app.use("/v1/user",userRoute);

app.use("/v1/post",postRoute);

app.use("/v1/comment",commentRoute);

// REQUEST TO GOOGLE
app.get('/auth/google',passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://my-blog-ten-snowy.vercel.app/"
  })
);

// REQUEST TO FACEBOOK
app.get('/auth/facebook',passport.authenticate('facebook', {
  scope: ['profile']
}));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "https://my-blog-ten-snowy.vercel.app/"
  })
);



app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    console.log('.........................');
})

    
// AUTHENTICATION
// AUTHORIZATION

const httpServer = createServer(app);
const io = new Server(httpServer, {  
    cors: {
        origin: "https://my-blog-ten-snowy.vercel.app/",
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when user connect
  console.log("a user connected.");

  // take userId and socketId from user client
  socket.on("newUser", (user) => {
    addUser(user?._id, socket.id);
    // io.emit("getonlineUsers",onlineUsers)
  });

  //send Notification to user
  socket.on(
    "sendNotification",
    ({
      sender_img,
      sender_user,
      action,
      action_icon,
      createdAt,
      reaction,
      user_receiver,
      seen,
    }) => {
      const user = getUser(user_receiver);
      if (user) {
        console.log("seen")
        io.to(user.socketId).emit("getNotification", {
            sender_img,
            sender_user,
            action,
            action_icon,
            createdAt,
            reaction,
            user_receiver,
            seen,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected.");
    removeUser(socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

httpServer.listen(5000);

// this is the main server file for the backend API
// imports
import express from "express"
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import chatRoute from "./routes/chat.route.js";

// app setup
const app=express();

// cross origin resource sharing setup for frontend-backend communication (localHost and vercel frontend deployment)
app.use(cors({
    origin:[process.env.CLIENT_URL,"https://my-real-estate-full-y7iu.vercel.app"],
    credentials:true,
}));

app.use(express.json());  // middleware to parse JSON request bodies
app.use(cookieParser());  // middleware to parse cookies

// route setup
app.use("/api/posts",postRoute);    // routes for post-related operations
app.use("/api/users",userRoute);    // routes for user-related operations
app.use("/api/auth",authRoute);     // routes for authentication operations
app.use("/api/test",testRoute);     // routes for test operations
app.use("/api/messages",messageRoute);   // routes for message-related operations
app.use("/api/chats",chatRoute);         // routes for chat-related operations


// server listening on port 8800
app.listen((8800),()=>{
    console.log("server is working");
});
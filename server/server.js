import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDb } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";



// create express app and HTPP server
const app = express();
const server = http.createServer(app)

// imitialize socket.io seerver
export const io = new Server(server,{
    cors:{origin: "*"}
})

// store online users
export const userScoketMap = {}; //userId:socketId


// socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connect", userId)
    if(userId) userScoketMap[userId] = socket.id;

    // emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userScoketMap));

    socket.on("disconnect", ()=> {
        console.log("User disconnected");
        delete userScoketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userScoketMap));
    })
})

// middleware setup
app.use(express.json({limit: "4mb"}))
app.use(cors())

// routes setup
app.use("/api/status",(req,res)=>res.send("Server is live"));
app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter)

// connect to mongodb
await connectDb()
if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000
    server.listen(PORT, ()=>console.log("Server is running on Port:" +PORT))    
}


// Export server for vercel
export default server;

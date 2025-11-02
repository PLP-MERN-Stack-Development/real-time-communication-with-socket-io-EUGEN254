import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store online users
let onlineUsers = {}; // { socketId: { username, currentRoom } }

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Set username
  socket.on("setUsername", (username) => {
    socket.username = username;
    onlineUsers[socket.id] = { username, currentRoom: "global" };
    socket.join("global");
    io.to("global").emit("notification", `${username} has joined the global room`);
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  // Join a room
  socket.on("joinRoom", (roomName) => {
    if (socket.currentRoom) socket.leave(socket.currentRoom);
    socket.join(roomName);
    socket.currentRoom = roomName;
    io.to(roomName).emit("notification", `${socket.username} has joined ${roomName}`);
  });

  // Global & room messages
  socket.on("sendMessage", ({ roomName, message }) => {
    const msg = {
      sender: socket.username,
      text: message,
      timestamp: new Date(),
    };
    io.to(roomName).emit("receiveMessage", msg);
  });

  // Typing indicator
  socket.on("typing", (roomName) => {
    socket.to(roomName).emit("userTyping", socket.username);
  });

  // Private message
  socket.on("privateMessage", ({ toSocketId, message }) => {
    const msg = { sender: socket.username, text: message, timestamp: new Date(), private: true };
    io.to(toSocketId).emit("privateMessage", msg);
  });

  // Read receipt
  socket.on("messageRead", ({ roomName }) => {
    io.to(roomName).emit("messageRead", { user: socket.username });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const username = onlineUsers[socket.id]?.username;
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
    if (username && socket.currentRoom) {
      io.to(socket.currentRoom).emit("notification", `${username} has left`);
    }
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));

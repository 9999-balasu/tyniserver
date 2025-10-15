
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// ==================
// 1. Setup Express + HTTP server
// ==================
const app = express();
const server = http.createServer(app);

// ==================
// 2. Setup Socket.IO
// ==================
const io = new Server(server, {
  // cors: {
  //   origin: "*", // allow all origins
  //   methods: ["GET", "POST"],
  // },

  cors: {
  origin: ["https://vehicle-connect-fp9q.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
},

});

// ==================
// 3. Connect MongoDB
// ==================
const MONGO_URI = "mongodb+srv://sunitha:yok@cluster0.ubyjgk7.mongodb.net/memoryGameDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ==================
// 4. Define Chat Schema
// ==================
const chatSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

// ==================
// 5. Socket.IO events
// ==================
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  let username = "Anon";

  // Receive username from client
  socket.on("setUsername", (name) => {
    username = name || "Anon";
    socket.broadcast.emit("chatMessage", {
      user: "System",
      message: `${username} joined the chat`,
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // Send last 10 messages when user joins
  Chat.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .then((msgs) => {
      socket.emit("chatHistory", msgs.reverse());
    });

  // Handle incoming messages
  socket.on("chatMessage", async (data) => {
    console.log("💬 New message:", data);

    // Save message to MongoDB
    const newMsg = new Chat({
      user: data.user,
      message: data.text || data.message,
      timestamp: new Date(),
    });
    await newMsg.save();

    // Broadcast message to all clients
    io.emit("chatMessage", {
      user: newMsg.user,
      message: newMsg.message,
      timestamp: newMsg.timestamp,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    socket.broadcast.emit("chatMessage", {
      user: "System",
      message: `${username} left the chat`,
      timestamp: new Date().toLocaleTimeString(),
    });
  });
});

// ==================
// 6. Start server
// ==================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});

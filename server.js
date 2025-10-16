
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");

// // ==================
// // 1. Setup Express + HTTP server
// // ==================
// const app = express();
// const server = http.createServer(app);

// // ==================
// // 2. Setup Socket.IO
// // ==================
// const io = new Server(server, {
//   // cors: {
//   //   origin: "*", // allow all origins
//   //   methods: ["GET", "POST"],
//   // },

//   cors: {
//   origin: ["https://vehicle-connect-fp9q.vercel.app"],
//   methods: ["GET", "POST"],
//   credentials: true,
// },

// });

// // ==================
// // 3. Connect MongoDB
// // ==================
// const MONGO_URI = "mongodb+srv://sunitha:yok@cluster0.ubyjgk7.mongodb.net/memoryGameDB?retryWrites=true&w=majority";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // ==================
// // 4. Define Chat Schema
// // ==================
// const chatSchema = new mongoose.Schema({
//   user: String,
//   message: String,
//   timestamp: { type: Date, default: Date.now },
// });

// const Chat = mongoose.model("Chat", chatSchema);

// // ==================
// // 5. Socket.IO events
// // ==================
// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   let username = "Anon";

//   // Receive username from client
//   socket.on("setUsername", (name) => {
//     username = name || "Anon";
//     socket.broadcast.emit("chatMessage", {
//       user: "System",
//       message: `${username} joined the chat`,
//       timestamp: new Date().toLocaleTimeString(),
//     });
//   });

//   // Send last 10 messages when user joins
//   Chat.find()
//     .sort({ timestamp: -1 })
//     .limit(10)
//     .then((msgs) => {
//       socket.emit("chatHistory", msgs.reverse());
//     });

//   // Handle incoming messages
//   socket.on("chatMessage", async (data) => {
//     console.log("💬 New message:", data);

//     // Save message to MongoDB
//     const newMsg = new Chat({
//       user: data.user,
//       message: data.text || data.message,
//       timestamp: new Date(),
//     });
//     await newMsg.save();

//     // Broadcast message to all clients
//     io.emit("chatMessage", {
//       user: newMsg.user,
//       message: newMsg.message,
//       timestamp: newMsg.timestamp,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//     socket.broadcast.emit("chatMessage", {
//       user: "System",
//       message: `${username} left the chat`,
//       timestamp: new Date().toLocaleTimeString(),
//     });
//   });
// });

// // ==================
// // 6. Start server
// // ==================
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
// });


// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");

// // ==================
// // 1. Setup Express + HTTP server
// // ==================
// const app = express();
// app.use(cors({
//   origin: ["https://vehicle-connect-fp9q.vercel.app"],
//   methods: ["GET", "POST"],
//   credentials: true,
// }));

// const server = http.createServer(app);

// // ==================
// // 2. Setup Socket.IO
// // ==================
// const io = new Server(server, {
//   cors: {
//     origin: ["https://vehicle-connect-fp9q.vercel.app"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // ==================
// // 3. Connect MongoDB
// // ==================
// const MONGO_URI = process.env.MONGODB_URI;
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // ==================
// // 4. Define Chat Schema
// // ==================
// const chatSchema = new mongoose.Schema({
//   user: String,
//   message: String,
//   timestamp: { type: Date, default: Date.now },
//   vehicleId: String,
// });

// const Chat = mongoose.model("Chat", chatSchema);

// // ==================
// // 5. Routes
// // ==================
// app.get("/", (req, res) => {
//   res.send("✅ TyNi Server is running fine!");
// });

// // ==================
// // 6. Socket.IO Events
// // ==================
// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   socket.on("joinRoom", async (vehicleId) => {
//     socket.join(vehicleId);
//     console.log(`🚗 Joined room: ${vehicleId}`);

//     // Send chat history for that vehicle
//     const history = await Chat.find({ vehicleId }).sort({ timestamp: 1 }).limit(50);
//     socket.emit("chatHistory", history);
//   });

//   socket.on("chatMessage", async (data) => {
//     const { user, message, vehicleId } = data;

//     const newMsg = new Chat({
//       user,
//       message,
//       vehicleId,
//       timestamp: new Date(),
//     });

//     await newMsg.save();

//     // Broadcast to all users in that vehicle room
//     io.to(vehicleId).emit("chatMessage", newMsg);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// // ==================
// // 7. Start Server
// // ==================
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 TyNi server running on http://localhost:${PORT}`);
// });

require('dotenv').config(); // This loads MONGODB_URI from your .env

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

// ==================
// 1. Setup Express
// ==================
const app = express();
app.use(cors({
  origin: ["https://vehicle-connect-fp9q.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
}));

const server = http.createServer(app);

// ==================
// 2. MongoDB Connection
// ==================
const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ==================
// 3. Chat Schema
// ==================
const chatSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  vehicleId: String,
});

const Chat = mongoose.model("Chat", chatSchema);

// ==================
// 4. Routes
// ==================
app.get("/", (req, res) => {
  res.send("✅ TyNi Server is running fine!");
});

// ==================
// 5. Socket.IO
// ==================
const io = new Server(server, {
  cors: {
    origin: ["https://vehicle-connect-fp9q.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join vehicle room
  socket.on("joinRoom", async (vehicleId) => {
    socket.join(vehicleId);
    console.log(`🚗 Joined room: ${vehicleId}`);

    // Send last 50 messages for this vehicle
    const history = await Chat.find({ vehicleId }).sort({ timestamp: 1 }).limit(50);
    socket.emit("chatHistory", history);
  });

  // Receive message
  socket.on("chatMessage", async (data) => {
    const { user, message, vehicleId } = data;

    const newMsg = await Chat.create({
      user,
      message,
      vehicleId,
      timestamp: new Date(),
    });

    // Broadcast to room
    io.to(vehicleId).emit("chatMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ==================
// 6. Start server
// ==================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 TyNi server running on port ${PORT}`);
});


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


// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(
//   cors({
//     origin: ["https://vehicle-connect-fp9q.vercel.app"], // your frontend on Vercel
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// const server = http.createServer(app);

// // ==================
// // MongoDB
// // ==================
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// // ==================
// // Chat Schema
// // ==================
// const chatSchema = new mongoose.Schema({
//   user: String,
//   message: String,
//   timestamp: { type: Date, default: Date.now },
//   vehicleId: String,
// });

// const Chat = mongoose.model("Chat", chatSchema);

// // ==================
// // Socket.IO setup
// // ==================
// const io = new Server(server, {
//   cors: {
//     origin: ["https://vehicle-connect-fp9q.vercel.app"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // ==================
// // Socket.IO events
// // ==================
// io.on("connection", (socket) => {
//   console.log("🔌 User connected:", socket.id);

//   // Join specific vehicle chat room
//   socket.on("joinRoom", async (vehicleId) => {
//     socket.join(vehicleId);
//     console.log(`📦 Joined room: ${vehicleId}`);

//     // Send previous messages for that vehicle
//     const history = await Chat.find({ vehicleId }).sort({ timestamp: 1 }).limit(50);
//     socket.emit("chatHistory", history);
//   });

// //   // Receive and save chat messages
// //   socket.on("chatMessage", async (data) => {
// //     try {
// //       const newMsg = await Chat.create({
// //         user: data.user,
// //         message: data.message,
// //         timestamp: new Date(),
// //         vehicleId: data.vehicleId, // ✅ important
// //       });

// //       // Send only to users in the same vehicle room
// //       io.to(data.vehicleId).emit("chatMessage", newMsg);
// //     } catch (err) {
// //       console.error("❌ Error saving chat:", err);
// //     }
// //   });

// //   socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
// // });

// // Receive and save chat messages
// socket.on("chatMessage", async (data) => {
//   try {
//     console.log("💬 New message received:", data);

//     const newMsg = await Chat.create({
//       user: data.user,
//       message: data.message,
//       timestamp: new Date(),
//       vehicleId: data.vehicleId, // ✅ important
//     });

//     console.log("✅ Message saved to DB:", newMsg);

//     // Send only to users in the same vehicle room
//     io.to(data.vehicleId).emit("chatMessage", newMsg);
//   } catch (err) {
//     console.error("❌ Error saving chat:", err.message);
//   }
// });
// })

// // ==================
// // Start server
// // ==================
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Allow your deployed Vercel frontend
app.use(
  cors({
    origin: ["https://vehicle-connect-fp9q.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// ==================
// MongoDB Connection
// ==================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log(`🗄️ Connected to MongoDB database: ${mongoose.connection.name}`);
});

// ==================
// Chat Schema
// ==================
const chatSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  vehicleId: String,
});

const Chat = mongoose.model("Chat", chatSchema);

// ==================
// Socket.IO Setup
// ==================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://vehicle-connect-fp9q.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ==================
// Socket Events
// ==================
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join a room for a specific vehicle
  socket.on("joinRoom", async (vehicleId) => {
    socket.join(vehicleId);
    console.log(`📦 User joined room: ${vehicleId}`);

    const history = await Chat.find({ vehicleId }).sort({ timestamp: 1 }).limit(50);
    socket.emit("chatHistory", history);
  });

  // When a new message arrives
  socket.on("chatMessage", async (data) => {
    console.log("💬 New message received:", data);

    try {
      const newMsg = await Chat.create({
        user: data.user,
        message: data.message,
        timestamp: new Date(),
        vehicleId: data.vehicleId,
      });

      console.log("✅ Message saved to DB:", newMsg);

      // Send the message only to users in that vehicle room
      io.to(data.vehicleId).emit("chatMessage", newMsg);
    } catch (err) {
      console.error("❌ Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ==================
// Start Server
// ==================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

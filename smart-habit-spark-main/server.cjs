// server.cjs
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests from localhost:8080 and localhost:5173 (or no origin for local testing)
      const allowedOrigins = ["http://localhost:8080", "http://localhost:5173"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true, // Optional: Allow cookies/auth credentials if needed
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("updateSettings", (settingsUpdate) => {
    console.log("Received settings update:", settingsUpdate);
    io.emit("settingsUpdate", settingsUpdate); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on("error", (err) => {
  console.error("Server startup error:", err.message);
  if (err.code === "EADDRINUSE") {
    console.error("Port 3000 is already in use. Please free it or use a different port.");
  }
  process.exit(1);
});
import express from "express";
import { connectDB } from "./Database/Connection/ConnectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import NotificationRoute from "./Routes/NotificationRoute.js";
import FollowRequestRoute from "./Routes/FollowRequestRoute.js";
import postRoute from "./Routes/PostRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_API_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "API is working...",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/user", UserRoute);
app.use("/api/notification", NotificationRoute);
app.use("/api/follow-request", FollowRequestRoute);
app.use("/api/post", postRoute);
app.use("/api/message", MessageRoute);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_API_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("send-message", (data) => {
    socket.broadcast.emit("recive-message", data);
    socket.broadcast.emit("update-last-message", data);
  });

  socket.on("send-notification", (data) => {
    socket.broadcast.emit("recive-notification", data);
  });

  socket.on("send-request", (data) => {
    socket.broadcast.emit("recive-request", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  await connectDB();
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Your backend is live on port ${PORT}`);
  });
};

startServer();

import express from "express";
import path from "path";
import cors from "cors";

// import { clerkMiddleware } from "@clerk/express";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:8081", // expo mobile
  "http://localhost:5173", // vite web devs
  process.env.FRONTEND_URL, // production
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow credentials from client (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json()); // parses incoming JSON request bodies and makes them available as req.body in your route handlers
// app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// error handlers must come after all the routes and other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
// app.use(errorHandler);

export default app;

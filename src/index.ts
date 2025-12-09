// import express from "express";
import express, { Request, Response, RequestHandler, NextFunction } from 'express'
import mongoose from 'mongoose';
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import { logger } from "./infrastructure/logger";
import { setupSwagger } from "./swagger";
import { errorHandler } from "./interface/middleware/errorHandler";
import { userRoutes } from "./interface/routes/userRoutes";
import { authRoutes } from "./interface/routes/authRoute";
import { storyRoutes } from "./interface/routes/storyRoutes";
import { postRoutes } from "./interface/routes/postRoute";
import { commentRoutes } from "./interface/routes/commentRoute";
import { chatRoutes } from "./interface/routes/chatRoute";
import { settingsRoutes } from "./interface/routes/settingsRoute";
import "./jobs/cleanup"; // Import the cleanup job
import cors from 'cors';
import dotenv from "dotenv";
import { initializeSocketIO } from "./socket";
import { Server } from "socket.io";
import http from "http";
import { StreamClient } from "@stream-io/node-sdk";
dotenv.config();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  console.error("Set STREAM_API_KEY and STREAM_API_SECRET in env");
  process.exit(1);
}

// create server client (server-side)
const serverClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5mins
  max: 200
})

console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(process.env.MONGO_URI,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  )
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
});

const app = express();

const allowedOrigins = [
 "*"
];

// Security headers for COOP and COEP
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


// app.options('*', cors()); // Enable preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter); // prevent brute-force attacks by limiting the number of requests a client can make in a given period
app.use(helmet()); // secure http headers and protect app from well known web vulnerabilities

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/stories", storyRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/comments", commentRoutes)
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/settings", settingsRoutes)

const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

app.post(
  "/token",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, name } = req.body;

    if (!userId) {
      res.status(400).json({ error: "userId required" });
      return; // <-- important to stop execution
    }

    try {
      const token = serverClient.generateUserToken(userId);

      // Do NOT return res.json(); just call it
      res.json({
        success: true,
        token,
        apiKey: STREAM_API_KEY,
        user: { id: userId, name },
      });
    } catch (err) {
      console.error("token error", err);
      res.status(500).json({ success: false, error: String(err) });
    }
  })
);



// app.post("/token", tokenRoute);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

initializeSocketIO(io);
app.set("io", io);

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  // join a personal room (useful for direct addressing)
  socket.on("join", ({ userId }) => {
    if (userId) socket.join(userId);
  });

  // Caller sends offer to server targeting calleeId
  socket.on("call-user", ({ to, from, offer, callType }) => {
    io.to(to).emit("incoming-call", { from, offer, callType });
  });

  // Callee replies with answer
  socket.on("answer-call", ({ to, from, answer }) => {
    io.to(to).emit("call-answered", { from, answer });
  });

  // ICE candidates exchange
  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", candidate);
  });

  // End call
  socket.on("end-call", ({ to }) => {
    io.to(to).emit("call-ended");
  });

  // Busy signal
  socket.on("busy", ({ to }) => {
    io.to(to).emit("user-busy");
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

app.use(express.static("public"));
app.use((err: any, req: any, res: any, next: any) => errorHandler(err, req, res, next));
setupSwagger(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

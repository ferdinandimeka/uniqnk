import express from "express";
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
import "./jobs/cleanup"; // Import the cleanup job
import cors from 'cors';
import dotenv from "dotenv";
import { initializeSocketIO } from "./socket";
import { Server } from "socket.io";
import http from "http";
dotenv.config();

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

app.use(express.static("public"));
app.use((err: any, req: any, res: any, next: any) => errorHandler(err, req, res, next));
setupSwagger(app);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

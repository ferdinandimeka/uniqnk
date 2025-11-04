"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = require("./infrastructure/logger");
const swagger_1 = require("./swagger");
const errorHandler_1 = require("./interface/middleware/errorHandler");
const userRoutes_1 = require("./interface/routes/userRoutes");
const authRoute_1 = require("./interface/routes/authRoute");
const storyRoutes_1 = require("./interface/routes/storyRoutes");
const postRoute_1 = require("./interface/routes/postRoute");
const commentRoute_1 = require("./interface/routes/commentRoute");
const chatRoute_1 = require("./interface/routes/chatRoute");
require("./jobs/cleanup"); // Import the cleanup job
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./socket");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5mins
    max: 200
});
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB!');
})
    .catch((err) => {
    console.log(err);
});
const app = (0, express_1.default)();
const allowedOrigins = [
    "*"
];
// // Use the cors middleware before any route handlers
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         // Allow requests with no origin (like curl or Postman)
//         callback(null, true);
//       } else {
//         callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );
// Security headers for COOP and COEP
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
// app.options('*', cors()); // Enable preflight requests for all routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(limiter); // prevent brute-force attacks by limiting the number of requests a client can make in a given period
app.use((0, helmet_1.default)()); // secure http headers and protect app from well known web vulnerabilities
app.use("/api/v1/auth", authRoute_1.authRoutes);
app.use("/api/v1/users", userRoutes_1.userRoutes);
app.use("/api/v1/stories", storyRoutes_1.storyRoutes);
app.use("/api/v1/posts", postRoute_1.postRoutes);
app.use("/api/v1/comments", commentRoute_1.commentRoutes);
app.use("/api/v1/chat", chatRoute_1.chatRoutes);
// Create HTTP server
const server = http_1.default.createServer(app);
// Initialize Socket.IO with proper CORS
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling", "websocket"],
});
(0, socket_1.initializeSocketIO)(io);
app.set("io", io);
app.use(express_1.default.static("public"));
app.use((err, req, res, next) => (0, errorHandler_1.errorHandler)(err, req, res, next));
(0, swagger_1.setupSwagger)(app);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger_1.logger.info(`Server is running on http://localhost:${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocketEvent = exports.initializeSocketIO = void 0;
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const UserModel_1 = require("./infrastructure/models/UserModel");
const apiError_1 = require("./utils/apiError");
// 📡 --- Join Chat Event ---
const mountJoinChatEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.JOIN_CHAT_EVENT, async (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.user?._id} joined chat 🤝 ${chatId}`);
    });
};
// ✍️ --- Typing Events ---
const mountParticipantStoppedTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.STOP_TYPING_EVENT, chatId);
    });
};
const mountParticipantTypingEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.TYPING_EVENT, chatId);
    });
};
// 🎥 --- Video Call Events ---
const mountVideoCallEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.START_VIDEO_CALL_EVENT, ({ chatId, targetUserId }) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.START_VIDEO_CALL_EVENT, {
            callerId: socket.user?._id,
            targetUserId,
        });
        console.log(`🎥 User ${socket.user?._id} started a video call with ${targetUserId}`);
    });
    // Handle WebRTC signaling
    socket.on(constants_1.ChatEventEnum.CALL_OFFER_EVENT, ({ offer, targetUserId }) => {
        socket.to(targetUserId).emit(constants_1.ChatEventEnum.CALL_OFFER_EVENT, {
            offer,
            callerId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.CALL_ANSWER_EVENT, ({ answer, callerId }) => {
        socket.to(callerId).emit(constants_1.ChatEventEnum.CALL_ANSWER_EVENT, {
            answer,
            targetUserId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, ({ candidate, targetUserId }) => {
        socket.to(targetUserId).emit(constants_1.ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, {
            candidate,
            callerId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.REJECT_CALL_EVENT, ({ callerId }) => {
        socket.to(callerId).emit(constants_1.ChatEventEnum.REJECT_CALL_EVENT, {
            receiverId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.END_CALL_EVENT, ({ chatId, targetUserId }) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.END_CALL_EVENT, {
            callerId: socket.user?._id,
            targetUserId,
        });
        console.log(`❌ User ${socket.user?._id} ended a video call with ${targetUserId}`);
    });
};
// 🎧 --- Audio Call Events ---
const mountAudioCallEvent = (socket) => {
    socket.on(constants_1.ChatEventEnum.START_AUDIO_CALL_EVENT, ({ chatId, targetUserId }) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.START_AUDIO_CALL_EVENT, {
            callerId: socket.user?._id,
            targetUserId,
        });
        console.log(`🎧 User ${socket.user?._id} started an audio call with ${targetUserId}`);
    });
    socket.on(constants_1.ChatEventEnum.CALL_OFFER_EVENT, ({ offer, targetUserId }) => {
        socket.to(targetUserId).emit(constants_1.ChatEventEnum.CALL_OFFER_EVENT, {
            offer,
            callerId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.CALL_ANSWER_EVENT, ({ answer, callerId }) => {
        socket.to(callerId).emit(constants_1.ChatEventEnum.CALL_ANSWER_EVENT, {
            answer,
            targetUserId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, ({ candidate, targetUserId }) => {
        socket.to(targetUserId).emit(constants_1.ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, {
            candidate,
            callerId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.REJECT_CALL_EVENT, ({ callerId }) => {
        socket.to(callerId).emit(constants_1.ChatEventEnum.REJECT_CALL_EVENT, {
            receiverId: socket.user?._id,
        });
    });
    socket.on(constants_1.ChatEventEnum.END_CALL_EVENT, ({ chatId, targetUserId }) => {
        socket.in(chatId).emit(constants_1.ChatEventEnum.END_CALL_EVENT, {
            callerId: socket.user?._id,
            targetUserId,
        });
        console.log(`🔚 User ${socket.user?._id} ended an audio call with ${targetUserId}`);
    });
};
// 🚀 --- Initialize Socket.IO ---
const initializeSocketIO = (io) => {
    io.on("connection", async (socket) => {
        try {
            const cookies = cookie_1.default.parse(socket.handshake.headers?.cookie || "");
            let token = cookies?.access_token || socket.handshake.auth?.token;
            if (!token)
                throw new apiError_1.ApiError(401, "Unauthorized handshake. Token missing.");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ||
                "4ac066d21a6caaade20466bae747cdf85f774f6a47bc50cb73df18d606228c4a9f5640bd50e0a5b42c4829a289b0ea12958aa07ba4812d291e47461d57968132");
            const user = await UserModel_1.UserModel.findById(decoded._id).select("-password");
            if (!user)
                throw new apiError_1.ApiError(401, "Unauthorized handshake. Invalid token.");
            // ✅ Explicitly cast `_id` to string when creating the socket user
            socket.user = {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                avatarUrl: user.profilePicture,
            };
            socket.join(socket.user._id);
            socket.emit(constants_1.ChatEventEnum.CONNECTED_EVENT);
            console.log(`✅ User ${socket.user._id} connected 🚀`);
            // Mount event handlers
            mountJoinChatEvent(socket);
            mountParticipantTypingEvent(socket);
            mountParticipantStoppedTypingEvent(socket);
            mountVideoCallEvent(socket);
            mountAudioCallEvent(socket);
            socket.on(constants_1.ChatEventEnum.DISCONNECT_EVENT, () => {
                console.log(`🚫 User disconnected: ${socket.user?._id}`);
                if (socket.user?._id)
                    socket.leave(socket.user._id);
            });
        }
        catch (error) {
            socket.emit(constants_1.ChatEventEnum.SOCKET_ERROR_EVENT, error?.message || "Socket connection failed.");
        }
    });
};
exports.initializeSocketIO = initializeSocketIO;
// 📤 --- Emit Utility ---
const emitSocketEvent = (req, roomId, event, payload) => {
    const io = req.app.get("io");
    io.in(roomId).emit(event, payload);
};
exports.emitSocketEvent = emitSocketEvent;

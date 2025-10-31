import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "./constants";
import { UserModel } from "./infrastructure/models/UserModel";
import { ApiError } from "./utils/apiError";
import { Request } from "express";

// 👤 Extend Socket to include authenticated user
interface SocketUser {
  _id: string;
  username: string;
  email?: string;
  [key: string]: any;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

// 📡 --- Join Chat Event ---
const mountJoinChatEvent = (socket: AuthenticatedSocket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, async (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.user?._id} joined chat 🤝 ${chatId}`);
  });
};

// ✍️ --- Typing Events ---
const mountParticipantStoppedTypingEvent = (socket: AuthenticatedSocket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

const mountParticipantTypingEvent = (socket: AuthenticatedSocket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

// 🎥 --- Video Call Events ---
const mountVideoCallEvent = (socket: AuthenticatedSocket) => {
  socket.on(ChatEventEnum.START_VIDEO_CALL_EVENT, ({ chatId, targetUserId }) => {
    socket.in(chatId).emit(ChatEventEnum.START_VIDEO_CALL_EVENT, {
      callerId: socket.user?._id,
      targetUserId,
    });
    console.log(`🎥 User ${socket.user?._id} started a video call with ${targetUserId}`);
  });

  // Handle WebRTC signaling
  socket.on(ChatEventEnum.CALL_OFFER_EVENT, ({ offer, targetUserId }) => {
    socket.to(targetUserId).emit(ChatEventEnum.CALL_OFFER_EVENT, {
      offer,
      callerId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.CALL_ANSWER_EVENT, ({ answer, callerId }) => {
    socket.to(callerId).emit(ChatEventEnum.CALL_ANSWER_EVENT, {
      answer,
      targetUserId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, ({ candidate, targetUserId }) => {
    socket.to(targetUserId).emit(ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, {
      candidate,
      callerId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.REJECT_CALL_EVENT, ({ callerId }) => {
    socket.to(callerId).emit(ChatEventEnum.REJECT_CALL_EVENT, {
      receiverId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.END_CALL_EVENT, ({ chatId, targetUserId }) => {
    socket.in(chatId).emit(ChatEventEnum.END_CALL_EVENT, {
      callerId: socket.user?._id,
      targetUserId,
    });
    console.log(`❌ User ${socket.user?._id} ended a video call with ${targetUserId}`);
  });
};

// 🎧 --- Audio Call Events ---
const mountAudioCallEvent = (socket: AuthenticatedSocket) => {
  socket.on(ChatEventEnum.START_AUDIO_CALL_EVENT, ({ chatId, targetUserId }) => {
    socket.in(chatId).emit(ChatEventEnum.START_AUDIO_CALL_EVENT, {
      callerId: socket.user?._id,
      targetUserId,
    });
    console.log(`🎧 User ${socket.user?._id} started an audio call with ${targetUserId}`);
  });

  socket.on(ChatEventEnum.CALL_OFFER_EVENT, ({ offer, targetUserId }) => {
    socket.to(targetUserId).emit(ChatEventEnum.CALL_OFFER_EVENT, {
      offer,
      callerId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.CALL_ANSWER_EVENT, ({ answer, callerId }) => {
    socket.to(callerId).emit(ChatEventEnum.CALL_ANSWER_EVENT, {
      answer,
      targetUserId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, ({ candidate, targetUserId }) => {
    socket.to(targetUserId).emit(ChatEventEnum.CALL_ICE_CANDIDATE_EVENT, {
      candidate,
      callerId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.REJECT_CALL_EVENT, ({ callerId }) => {
    socket.to(callerId).emit(ChatEventEnum.REJECT_CALL_EVENT, {
      receiverId: socket.user?._id,
    });
  });

  socket.on(ChatEventEnum.END_CALL_EVENT, ({ chatId, targetUserId }) => {
    socket.in(chatId).emit(ChatEventEnum.END_CALL_EVENT, {
      callerId: socket.user?._id,
      targetUserId,
    });
    console.log(`🔚 User ${socket.user?._id} ended an audio call with ${targetUserId}`);
  });
};

// 🚀 --- Initialize Socket.IO ---
const initializeSocketIO = (io: Server) => {
  io.on("connection", async (socket: AuthenticatedSocket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.access_token || socket.handshake.auth?.token;

      if (!token) throw new ApiError(401, "Unauthorized handshake. Token missing.");

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          "4ac066d21a6caaade20466bae747cdf85f774f6a47bc50cb73df18d606228c4a9f5640bd50e0a5b42c4829a289b0ea12958aa07ba4812d291e47461d57968132"
      ) as { _id: string };

      const user = await UserModel.findById(decoded._id).select("-password");
      if (!user) throw new ApiError(401, "Unauthorized handshake. Invalid token.");

      // ✅ Explicitly cast `_id` to string when creating the socket user
      socket.user = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatarUrl: user.profilePicture,
      };

      socket.join(socket.user._id);
      socket.emit(ChatEventEnum.CONNECTED_EVENT);

      console.log(`✅ User ${socket.user._id} connected 🚀`);

      // Mount event handlers
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);
      mountVideoCallEvent(socket);
      mountAudioCallEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log(`🚫 User disconnected: ${socket.user?._id}`);
        if (socket.user?._id) socket.leave(socket.user._id);
      });
    } catch (error: any) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Socket connection failed."
      );
    }
  });
};

// 📤 --- Emit Utility ---
const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: ChatEventEnum,
  payload: any
): void => {
  const io: Server = req.app.get("io");
  io.in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };

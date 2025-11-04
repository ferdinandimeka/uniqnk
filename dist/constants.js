"use strict";
// constants/chatEvents.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEventEnum = void 0;
/** Enum for all chat-related socket event names */
var ChatEventEnum;
(function (ChatEventEnum) {
    // Connection
    ChatEventEnum["CONNECTED_EVENT"] = "connected";
    ChatEventEnum["DISCONNECT_EVENT"] = "disconnect";
    ChatEventEnum["SOCKET_ERROR_EVENT"] = "socket_error";
    // Chat-related
    ChatEventEnum["JOIN_CHAT_EVENT"] = "join_chat";
    ChatEventEnum["NEW_MESSAGE_EVENT"] = "new_message";
    ChatEventEnum["MESSAGE_READ_EVENT"] = "message_read";
    ChatEventEnum["NEW_CHAT_EVENT"] = "new_chat";
    ChatEventEnum["MESSAGE_RECEIVED_EVENT"] = "message_received";
    ChatEventEnum["CHAT_DELETED_EVENT"] = "chat_delete";
    ChatEventEnum["MESSAGE_DELETED_EVENT"] = "message_delete";
    // Typing indicators
    ChatEventEnum["TYPING_EVENT"] = "typing";
    ChatEventEnum["STOP_TYPING_EVENT"] = "stop_typing";
    // Video call events
    ChatEventEnum["START_VIDEO_CALL_EVENT"] = "start_video_call";
    ChatEventEnum["CALL_OFFER_EVENT"] = "call_offer";
    ChatEventEnum["CALL_ANSWER_EVENT"] = "call_answer";
    ChatEventEnum["CALL_ICE_CANDIDATE_EVENT"] = "call_ice_candidate";
    ChatEventEnum["REJECT_CALL_EVENT"] = "reject_call";
    ChatEventEnum["END_CALL_EVENT"] = "end_call";
    // Audio call events
    ChatEventEnum["START_AUDIO_CALL_EVENT"] = "start_audio_call";
})(ChatEventEnum || (exports.ChatEventEnum = ChatEventEnum = {}));

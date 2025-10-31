// constants/chatEvents.ts

/** Enum for all chat-related socket event names */
export enum ChatEventEnum {
  // Connection
  CONNECTED_EVENT = "connected",
  DISCONNECT_EVENT = "disconnect",
  SOCKET_ERROR_EVENT = "socket_error",

  // Chat-related
  JOIN_CHAT_EVENT = "join_chat",
  NEW_MESSAGE_EVENT = "new_message",
  MESSAGE_READ_EVENT = "message_read",
  NEW_CHAT_EVENT = "new_chat", // ✅ Added this
  MESSAGE_RECEIVED_EVENT = "message_received", // ✅ Added this
  CHAT_DELETED_EVENT = "chat_delete", // ✅ Added this
  MESSAGE_DELETED_EVENT = "message_delete", // ✅ Added this

  // Typing indicators
  TYPING_EVENT = "typing",
  STOP_TYPING_EVENT = "stop_typing",

  // Video call events
  START_VIDEO_CALL_EVENT = "start_video_call",
  CALL_OFFER_EVENT = "call_offer",
  CALL_ANSWER_EVENT = "call_answer",
  CALL_ICE_CANDIDATE_EVENT = "call_ice_candidate",
  REJECT_CALL_EVENT = "reject_call",
  END_CALL_EVENT = "end_call",

  // Audio call events
  START_AUDIO_CALL_EVENT = "start_audio_call",
}

/** Union type of all valid chat event strings */
export type AvailableChatEvents = `${ChatEventEnum}`;

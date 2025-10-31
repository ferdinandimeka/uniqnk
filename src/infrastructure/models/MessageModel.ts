import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  chatId: Types.ObjectId; // ID of the chat (group or private)
  sender: Types.ObjectId; // User who sent the message
  receiver?: Types.ObjectId; // Optional: for 1-on-1 chats
  text?: string; // message content
  mediaUrls?: string[]; // image or video URLs
  isRead: boolean; // read/unread flag
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, trim: true },
    mediaUrls: [{ type: String }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Validation: Ensure that at least text or media is provided
ChatMessageSchema.pre("validate", function (next) {
  if (!this.text && (!this.mediaUrls || this.mediaUrls.length === 0)) {
    return next(new Error("Message must contain text or media."));
  }
  next();
});

export const ChatMessageModel = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);

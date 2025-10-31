import mongoose, { Schema, Document, Types } from "mongoose";

export interface Chat {
  _id?: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatSchema = new mongoose.Schema<Chat>(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<Chat>("Chat", ChatSchema);
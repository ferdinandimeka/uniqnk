import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    mediaUrls?: string[];
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mediaUrls: [{ type: String }],
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
export { MessageModel, IMessage };

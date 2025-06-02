import mongoose, { Schema, Document } from "mongoose";

interface IFriendRequest extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

const FriendRequestModel = mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema);
export { FriendRequestModel, IFriendRequest };

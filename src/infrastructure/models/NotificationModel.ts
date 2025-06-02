import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export { NotificationModel, INotification };

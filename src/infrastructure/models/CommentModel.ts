import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
    post: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    content: string;
    replies: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);
export { CommentModel, IComment };

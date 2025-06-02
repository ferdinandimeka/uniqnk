import mongoose, { Schema, Document } from "mongoose";

interface IGroup extends Document {
    name: string;
    description: string;
    members: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });

const GroupModel = mongoose.model<IGroup>("Group", GroupSchema);
export { GroupModel, IGroup };

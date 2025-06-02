import mongoose, { Schema, Document } from "mongoose";

interface IPage extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    followers: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const PageSchema = new Schema<IPage>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });

const PageModel = mongoose.model<IPage>("Page", PageSchema);
export { PageModel, IPage };

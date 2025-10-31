import mongoose, { Schema, Document, Types } from "mongoose";

interface Reaction {
  user: Types.ObjectId;
  type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  timestamp: Date;
}

interface Location {
  name?: string; // e.g. "Lagos, Nigeria"
  latitude?: number;
  longitude?: number;
}

interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  mediaUrls?: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: mongoose.Types.ObjectId[];
  reactions: Reaction[];
  rank?: number;
  location?: Location; // ✅ added
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mediaUrls: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    shares: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"],
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    rank: { type: Number, default: 0 },

    // ✅ Added location field
    location: {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<IPost>("Post", PostSchema);
export { PostModel, IPost };

// import mongoose, { Schema, Document } from "mongoose";

// interface INotification extends Document {
//     user: mongoose.Types.ObjectId;
//     type: string;
//     content: string;
//     isRead: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const NotificationSchema = new Schema<INotification>({
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     type: { type: String, required: true },
//     content: { type: String, required: true },
//     isRead: { type: Boolean, default: false },
// }, { timestamps: true });

// const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
// export { NotificationModel, INotification };


import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "mention"
  | "repost"
  | "system";

interface INotification extends Document {
  user: mongoose.Types.ObjectId;         // receiver
  type: NotificationType;

  /**
   * Aggregation
   */
  actors: mongoose.Types.ObjectId[];           // users who triggered it
  count: number;

  /**
   * Context
   */
  post?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;

  /**
   * Display
   */
  content: string;                             // fallback / legacy
  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "reply",
        "follow",
        "mention",
        "repost",
        "system",
      ],
      required: true,
      index: true,
    },

    /**
     * Aggregation fields
     */
    actors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    count: {
      type: Number,
      default: 1,
    },

    /**
     * Context (optional)
     */
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    /**
     * Legacy / fallback text
     */
    content: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate actors
 */
NotificationSchema.pre("save", function (next) {
  if (this.actors?.length) {
    this.actors = Array.from(
      new Set(this.actors.map((id) => id.toString()))
    ).map((id) => new mongoose.Types.ObjectId(id));
  }
  next();
});

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export { NotificationModel, INotification };
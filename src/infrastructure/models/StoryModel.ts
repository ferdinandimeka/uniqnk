import mongoose, { Schema, Document, Types } from "mongoose";

interface IStory extends Document {
    user: Types.ObjectId;
    contentType: "image" | "video" | "text";
    contentUrl?: string;
    text?: string;
    backgroundColor?: string;
    createdAt: Date;
    expiresAt: Date;
    viewers: Types.ObjectId[];
    reactions: {
        user: Types.ObjectId;
        type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
        timestamp: Date;
    }[];
}

const StorySchema = new Schema<IStory>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contentType: {
        type: String,
        enum: ["image", "video", "text"],
        required: true
    },
    contentUrl: {
        type: String,
        // required: true
    },
    text: {
        type: String,
        trim: true
    },
    backgroundColor: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 86400000) // 24 hours from now
    },
    viewers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    reactions: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["like", "love", "haha", "wow", "sad", "angry"],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

// Add a viewer to the story
StorySchema.methods.addViewer = async function (userId: Types.ObjectId) {
    if (!this.viewers.includes(userId)) {
        this.viewers.push(userId);
        await this.save();
    }
};

// Add a reaction to the story
StorySchema.methods.addReaction = async function (userId: Types.ObjectId, reactionType: string) {
    const existingReactionIndex = this.reactions.findIndex((reaction: { user: { equals: (arg0: Types.ObjectId) => any; }; }) => reaction.user.equals(userId));
    
    if (existingReactionIndex !== -1) {
        this.reactions[existingReactionIndex].type = reactionType;
        this.reactions[existingReactionIndex].timestamp = new Date();
    } else {
        this.reactions.push({
            user: userId,
            type: reactionType,
            timestamp: new Date()
        });
    }

    await this.save();
};

StorySchema.statics.getActiveStories = function (userId: Types.ObjectId) {
    const now = new Date();
    return this.find({
        user: userId,
        expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });
};

const StoryModel = mongoose.model<IStory>("Story", StorySchema);
export { StoryModel, IStory };

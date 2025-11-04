"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const StorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }],
    reactions: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
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
StorySchema.methods.addViewer = async function (userId) {
    if (!this.viewers.includes(userId)) {
        this.viewers.push(userId);
        await this.save();
    }
};
// Add a reaction to the story
StorySchema.methods.addReaction = async function (userId, reactionType) {
    const existingReactionIndex = this.reactions.findIndex((reaction) => reaction.user.equals(userId));
    if (existingReactionIndex !== -1) {
        this.reactions[existingReactionIndex].type = reactionType;
        this.reactions[existingReactionIndex].timestamp = new Date();
    }
    else {
        this.reactions.push({
            user: userId,
            type: reactionType,
            timestamp: new Date()
        });
    }
    await this.save();
};
StorySchema.statics.getActiveStories = function (userId) {
    const now = new Date();
    return this.find({
        user: userId,
        expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });
};
const StoryModel = mongoose_1.default.model("Story", StorySchema);
exports.StoryModel = StoryModel;

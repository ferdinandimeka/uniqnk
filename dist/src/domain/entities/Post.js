"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(id, user, content, mediaUrls = [], likes = [], comments = [], shares = [], reactions = {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0
    }, rank = 0, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.mediaUrls = mediaUrls;
        this.likes = likes;
        this.comments = comments;
        this.shares = shares;
        this.reactions = reactions;
        this.rank = rank;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        // Validate user ID
        if (!user || typeof user !== "string" || user.trim().length === 0) {
            throw new Error("User ID is required and must be a non-empty string");
        }
        // Validate content
        if (!content || typeof content !== "string" || content.trim().length === 0) {
            throw new Error("Content is required and must be a non-empty string");
        }
        // Validate media URLs
        for (const url of mediaUrls) {
            if (!/^https?:\/\/\S+\.\S+$/.test(url)) {
                throw new Error(`Invalid media URL: ${url}`);
            }
        }
        // Ensure updatedAt is not before createdAt
        if (updatedAt < createdAt) {
            throw new Error("UpdatedAt cannot be before CreatedAt");
        }
    }
    addLike(userId) {
        if (!this.likes.includes(userId)) {
            this.likes.push(userId);
            this.updatedAt = new Date();
        }
    }
    addComment(commentId) {
        this.comments.push(commentId);
        this.updatedAt = new Date();
    }
    addShare(userId) {
        if (!this.shares.includes(userId)) {
            this.shares.push(userId);
            this.updatedAt = new Date();
        }
    }
    addReaction(userId, type) {
        if (this.reactions[type] !== undefined) {
            this.reactions[type]++;
            this.updatedAt = new Date();
        }
        else {
            throw new Error(`Invalid reaction type. Allowed types are: ${Object.keys(this.reactions).join(", ")}`);
        }
    }
}
exports.Post = Post;

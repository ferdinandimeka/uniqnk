"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoPostRepository = void 0;
const PostModel_1 = require("../models/PostModel");
const CommentModel_1 = require("../models/CommentModel");
const ranking_1 = require("../../utils/ranking");
const mongoose_1 = __importDefault(require("mongoose"));
class MongoPostRepository {
    async findAll() {
        const posts = await PostModel_1.PostModel.find()
            .populate({
            path: "user",
            select: "fullName username profilePicture location", // select only needed fields
        })
            .sort({ createdAt: -1 }); // optional: newest first
        return posts.map(post => this.toPost(post));
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid post ID format');
        }
        // const post = await PostModel.findById(id);
        // Re-fetch with populated comments AFTER saving
        const populatedPost = await PostModel_1.PostModel.findById(id)
            .populate({
            path: "comments",
            match: { parentComment: null },
            populate: [
                { path: "user", select: "username" },
                {
                    path: "replies",
                    populate: { path: "user", select: "username" }
                },
            ],
        })
            .sort({ createdAt: -1 }) // optional: newest first
            .lean(); // returns plain JS object, no need for `toPost`
        if (!populatedPost) {
            return null;
        }
        const postWithCounts = {
            ...populatedPost,
            num_comments: Array.isArray(populatedPost.comments) ? populatedPost.comments.length : 0,
        };
        return postWithCounts;
    }
    async findByUserId(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }
        const posts = await PostModel_1.PostModel.find({ userId });
        return posts.map(post => this.toPost(post));
    }
    async create(post) {
        const newPost = new PostModel_1.PostModel(post);
        const savedPost = await newPost.save();
        return this.toPost(savedPost);
    }
    async update(post) {
        const newPost = await PostModel_1.PostModel.findByIdAndUpdate(post.id, post, { new: true });
        return this.toPost(newPost);
    }
    async delete(id) {
        await PostModel_1.PostModel.findByIdAndDelete(id);
    }
    //  async likeComment(commentId: string, userId: string): Promise<IComment | null> {
    //     const comment = await CommentModel.findById(commentId);
    //     if (!comment) return null;
    //     if (!comment.likes.includes(new Types.ObjectId(userId))) {
    //       comment.likes.push(new Types.ObjectId(userId));
    //       await comment.save();
    //     }
    //     return comment;
    //   }
    async addLike(postId, userId) {
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.likes) {
            post.likes = [];
        }
        if (!post.likes.includes(new mongoose_1.default.Types.ObjectId(userId))) {
            post.likes.push(new mongoose_1.default.Types.ObjectId(userId));
            await post.save();
        }
        return this.toPost(post);
    }
    // async removeLike(postId: string, userId: string): Promise<Post | null> {
    //     const post = await PostModel.findById(postId);
    //     const userObjectId = new mongoose.Types.ObjectId(userId);
    //     if (!mongoose.Types.ObjectId.isValid(userId)) {
    //         throw new Error('Invalid user ID format');
    //     }
    //     if (!mongoose.Types.ObjectId.isValid(postId)) {
    //         throw new Error('Invalid post ID format');
    //     }
    //     if (!post) {
    //         throw new Error('Post not found');
    //     }
    //     if (post.likes && post.likes.includes(userObjectId)) {
    //         // Remove the like from the post
    //         post.likes = post.likes.filter((like: mongoose.Types.ObjectId) => like.toString() !== userObjectId.toString());
    //         await post.save();
    //     }
    //     return this.toPost(post);
    // }
    async removeLike(postId, userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid post ID format");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post)
            throw new Error("Post not found");
        const beforeCount = post.likes.length;
        // ✅ Safely filter by string value
        const updatedLikes = post.likes.filter((like) => like.toString() !== userId.toString());
        post.set("likes", updatedLikes); // 🔥 ensures overwrite
        await post.save({ validateBeforeSave: false });
        console.log(`Removed ${beforeCount - post.likes.length} likes`);
        return this.toPost(post);
    }
    // async addComment(postId: string, commentId: string): Promise<Post | null> {
    //     const post = await PostModel.findById(postId);
    //     const commentObjectId = new mongoose.Types.ObjectId(commentId);
    //     if (!mongoose.Types.ObjectId.isValid(postId)) {
    //         throw new Error('Invalid post ID format');
    //     }
    //     if (!post) {
    //         throw new Error('Post not found');
    //     }
    //     if (!post.comments) {
    //         post.comments = [];
    //     }
    //     if (!post.comments.includes(commentObjectId)) {
    //         post.comments.push(commentObjectId);
    //         await post.save();
    //     }
    //     return this.toPost(post);
    // }
    async addComment(postId, commentId) {
        // Validate ObjectId formats
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid post ID format");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
            throw new Error("Invalid comment ID format");
        }
        // Fetch Post
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        // ✅ Verify comment exists before pushing
        const commentExists = await CommentModel_1.CommentModel.findById(commentId);
        if (!commentExists) {
            throw new Error("Comment not found or failed to create");
        }
        const commentObjectId = new mongoose_1.default.Types.ObjectId(commentId);
        // Initialize comments array if missing
        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }
        // Avoid duplicates
        const alreadyHasComment = post.comments.some((c) => c.toString() === commentObjectId.toString());
        if (!alreadyHasComment) {
            post.comments.push(commentObjectId);
            await post.save();
        }
        // ✅ Re-fetch with populated comments & users
        const populatedPost = await PostModel_1.PostModel.findById(postId);
        //    .populate({
        //         path: "comments",
        //         match: { user: { $ne: null } }, // filter out comments without valid user
        //         populate: {
        //             path: "user",
        //             match: { _id: { $ne: null } }, // filter out null users
        //             select: "username avatar",
        //         },
        //     })
        //     .lean();
        if (!populatedPost) {
            throw new Error("Failed to populate post after adding comment");
        }
        return populatedPost;
    }
    async removeComment(postId, commentId) {
        const post = await PostModel_1.PostModel.findById(postId);
        const commentObjectId = new mongoose_1.default.Types.ObjectId(commentId);
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid post ID format');
        }
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.comments && post.comments.includes(commentObjectId)) {
            post.comments = post.comments.filter((comment) => comment !== commentObjectId);
            await post.save();
        }
        return this.toPost(post);
    }
    async addShare(postId, userId) {
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.shares) {
            post.shares = [];
        }
        if (!post.shares.includes(new mongoose_1.default.Types.ObjectId(userId))) {
            post.shares.push(new mongoose_1.default.Types.ObjectId(userId));
            await post.save();
        }
        return this.toPost(post);
    }
    async removeShare(postId, userId) {
        const post = await PostModel_1.PostModel.findById(postId);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid post ID format');
        }
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.shares && post.shares.includes(userObjectId)) {
            post.shares = post.shares.filter((share) => share.toString() !== userObjectId.toString());
            await post.save();
        }
        return this.toPost(post);
    }
    async addReaction(postId, userId, reactionType) {
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.reactions) {
            post.reactions = [];
        }
        const existingReaction = post.reactions.find((reaction) => reaction.user.toString() === userId);
        if (existingReaction) {
            existingReaction.type = reactionType;
        }
        else {
            post.reactions.push({
                user: new mongoose_1.default.Types.ObjectId(userId),
                type: reactionType,
                timestamp: new Date(),
            });
        }
        await post.save();
        return this.toPost(post);
    }
    async removeReaction(postId, userId) {
        const post = await PostModel_1.PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.reactions) {
            post.reactions = [];
        }
        const reactionIndex = post.reactions.findIndex((reaction) => reaction.user.toString() === userId);
        if (reactionIndex !== -1) {
            post.reactions.splice(reactionIndex, 1);
        }
        await post.save();
        return this.toPost(post);
    }
    async getRankedPost(userId) {
        const posts = await PostModel_1.PostModel.find({ userId });
        const rankedPosts = (0, ranking_1.rankPosts)(posts, userId);
        return rankedPosts.map(post => this.toPost(post));
    }
    toPost(postDoc) {
        const postObj = postDoc.toObject();
        return {
            ...postObj,
            id: postObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
exports.MongoPostRepository = MongoPostRepository;

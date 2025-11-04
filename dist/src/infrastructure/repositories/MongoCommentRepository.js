"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoCommentRepository = void 0;
const CommentModel_1 = require("../models/CommentModel");
const PostModel_1 = require("../models/PostModel");
const mongoose_1 = require("mongoose");
class MongoCommentRepository {
    /**
     * Create a new comment document.
     */
    async create(data) {
        const newComment = new CommentModel_1.CommentModel({
            post: data.post,
            user: data.user,
            content: data.content,
            parentComment: data.parentComment,
        });
        await newComment.save();
        return newComment;
    }
    /**
     * reply to comment.
     */
    async replyToComment(commentId, userId, postId, content) {
        const parentComment = await CommentModel_1.CommentModel.findById(commentId);
        if (!parentComment)
            throw new Error("Parent comment not found");
        const reply = await this.create({
            post: postId,
            user: userId,
            content,
            parentComment: commentId,
        });
        parentComment.replies.push(new mongoose_1.Types.ObjectId(reply._id));
        await parentComment.save();
        // 4️⃣ Optionally update the post (if you want `num_comments` to increase)
        await PostModel_1.PostModel.findByIdAndUpdate(postId, { $inc: { num_comments: 1 } });
        // 5️⃣ Return reply populated for frontend
        return await CommentModel_1.CommentModel.findById(reply._id)
            .populate("user", "username")
            .populate("parentComment", "content");
    }
    /**
     * Find a comment by its ID.
     */
    async findById(id) {
        return CommentModel_1.CommentModel.findById(id)
            .populate("post")
            .populate("user", "username profilePicture")
            .populate("replies")
            .exec();
    }
    /**
     * Get all comments for a specific post.
     */
    async findByPostId(postId) {
        return CommentModel_1.CommentModel.find({ post: postId })
            .populate("user", "username profilePicture")
            .populate({
            path: "replies",
            populate: { path: "user", select: "username profilePicture" },
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    /**
     * Delete a comment by ID.
     */
    async deleteById(id) {
        const result = await CommentModel_1.CommentModel.findByIdAndDelete(id);
        return !!result;
    }
    /**
     * Like a comment.
     */
    async likeComment(commentId, userId) {
        const comment = await CommentModel_1.CommentModel.findById(commentId);
        if (!comment)
            return null;
        if (!comment.likes.includes(new mongoose_1.Types.ObjectId(userId))) {
            comment.likes.push(new mongoose_1.Types.ObjectId(userId));
            await comment.save();
        }
        return comment;
    }
    /**
     * Unlike a comment.
     */
    async unlikeComment(commentId, userId) {
        const comment = await CommentModel_1.CommentModel.findById(commentId);
        if (!comment)
            return null;
        comment.likes = comment.likes.filter((id) => String(id) !== userId);
        await comment.save();
        return comment;
    }
}
exports.MongoCommentRepository = MongoCommentRepository;

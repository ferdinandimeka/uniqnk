"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
class CommentController {
    constructor(
    // private addCommentUseCase,
    replyToCommentUseCase, getCommentByIdUseCase, AddLikeCommentUseCase, unLikeCommentUseCase) {
        this.replyToCommentUseCase = replyToCommentUseCase;
        this.getCommentByIdUseCase = getCommentByIdUseCase;
        this.AddLikeCommentUseCase = AddLikeCommentUseCase;
        this.unLikeCommentUseCase = unLikeCommentUseCase;
    }
    async replyToComment(req, res, next) {
        try {
            const { commentId } = req.params; // parent comment
            const { userId, postId, content } = req.body;
            const reply = await this.replyToCommentUseCase.execute(commentId, userId, postId, content);
            return res.status(201).json({
                success: true,
                message: "Reply added successfully",
                data: reply,
            });
        }
        catch (error) {
            console.error("Error replying to comment:", error);
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ success: false, message });
        }
    }
    async getCommentById(req, res, next) {
        try {
            const { commentId } = req.params;
            const comment = await this.getCommentByIdUseCase.execute(commentId);
            return res.status(200).json({
                success: true,
                data: comment,
            });
        }
        catch (error) {
            console.error("Error getting comment by ID:", error);
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ success: false, message });
        }
    }
    async likeComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { userId } = req.body;
            const updatedComment = await this.AddLikeCommentUseCase.execute(commentId, userId);
            return res.status(200).json({
                success: true,
                message: "Comment liked successfully",
                data: updatedComment,
            });
        }
        catch (error) {
            console.error("Error liking comment:", error);
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ success: false, message });
        }
    }
    async unlikeComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { userId } = req.body;
            const updatedComment = await this.unLikeCommentUseCase.execute(commentId, userId);
            return res.status(200).json({
                success: true,
                message: "Comment unliked successfully",
                data: updatedComment,
            });
        }
        catch (error) {
            console.error("Error unliking comment:", error);
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ success: false, message });
        }
    }
}
exports.CommentController = CommentController;

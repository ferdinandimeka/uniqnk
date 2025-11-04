"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyToCommentUseCase = void 0;
class ReplyToCommentUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId, userId, postId, content) {
        if (!content)
            throw new Error("Reply content is required");
        return await this.commentRepository.replyToComment(commentId, userId, postId, content);
    }
}
exports.ReplyToCommentUseCase = ReplyToCommentUseCase;

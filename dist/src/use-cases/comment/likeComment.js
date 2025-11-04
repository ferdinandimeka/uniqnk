"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeCommentUseCase = void 0;
class LikeCommentUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId, userId) {
        return this.commentRepository.likeComment(commentId, userId);
    }
}
exports.LikeCommentUseCase = LikeCommentUseCase;

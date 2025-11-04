"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnLikeCommentUseCase = void 0;
class UnLikeCommentUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId, userId) {
        return this.commentRepository.unlikeComment(commentId, userId);
    }
}
exports.UnLikeCommentUseCase = UnLikeCommentUseCase;

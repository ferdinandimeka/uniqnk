"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentByIdUseCase = void 0;
class GetCommentByIdUseCase {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async execute(commentId) {
        return this.commentRepository.findById(commentId);
    }
}
exports.GetCommentByIdUseCase = GetCommentByIdUseCase;

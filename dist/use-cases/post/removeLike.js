"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveLike = void 0;
class RemoveLike {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId) {
        return this.postRepository.removeLike(postId, userId);
    }
}
exports.RemoveLike = RemoveLike;

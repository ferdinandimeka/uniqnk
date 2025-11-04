"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveShare = void 0;
class RemoveShare {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        post.shares = post.shares.filter((share) => share !== userId);
        return await this.postRepository.update(post);
    }
}
exports.RemoveShare = RemoveShare;

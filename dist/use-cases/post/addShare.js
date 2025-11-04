"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddShare = void 0;
class AddShare {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        post.shares.push(userId);
        return await this.postRepository.update(post);
    }
}
exports.AddShare = AddShare;

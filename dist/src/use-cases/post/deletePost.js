"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePost = void 0;
class DeletePost {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        await this.postRepository.delete(postId);
    }
}
exports.DeletePost = DeletePost;

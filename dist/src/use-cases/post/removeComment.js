"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveComment = void 0;
class RemoveComment {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, commentId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        post.comments = post.comments.filter((comment) => comment.toString() !== commentId.toString());
        await this.postRepository.update(post);
        return post;
    }
}
exports.RemoveComment = RemoveComment;

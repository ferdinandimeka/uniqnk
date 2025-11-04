"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReaction = void 0;
class AddReaction {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, reactionType) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        if (post.reactions[reactionType] !== undefined) {
            post.reactions[reactionType]++;
        }
        return await this.postRepository.update(post);
    }
}
exports.AddReaction = AddReaction;

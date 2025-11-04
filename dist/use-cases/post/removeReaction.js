"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveReaction = void 0;
class RemoveReaction {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId, reactionType) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        // Validate the reaction type
        if (!(reactionType in post.reactions)) {
            throw new Error(`Invalid reaction type. Allowed types are: ${Object.keys(post.reactions).join(", ")}`);
        }
        // Check if the user has reacted before
        if (post.likes.includes(userId)) {
            // Decrement the reaction count, but ensure it doesn't go below zero
            post.reactions[reactionType] = Math.max(0, post.reactions[reactionType] - 1);
            // Remove the user from the likes list if the reaction was a like
            post.likes = post.likes.filter((id) => id !== userId);
            post.updatedAt = new Date();
        }
        return await this.postRepository.update(post);
    }
}
exports.RemoveReaction = RemoveReaction;

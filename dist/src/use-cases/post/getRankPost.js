"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRankedPosts = void 0;
class GetRankedPosts {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(userId) {
        const posts = await this.postRepository.findByUserId(userId);
        const rankedPosts = [];
        for (const post of posts) {
            const rank = (post.likes?.length || 0) + (post.comments?.length || 0);
            post.rank = rank;
            const updatedPost = await this.postRepository.update(post);
            if (updatedPost)
                rankedPosts.push(updatedPost);
        }
        // Optionally sort by rank descending
        rankedPosts.sort((a, b) => (b.rank || 0) - (a.rank || 0));
        return rankedPosts;
    }
}
exports.GetRankedPosts = GetRankedPosts;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePost = void 0;
class UpdatePost {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, updatedPost) {
        const existingPost = await this.postRepository.findById(postId);
        if (!existingPost) {
            return null; // or throw an error
        }
        const mergedPost = Object.assign(Object.create(Object.getPrototypeOf(existingPost)), existingPost, updatedPost);
        return await this.postRepository.update(mergedPost);
    }
}
exports.UpdatePost = UpdatePost;

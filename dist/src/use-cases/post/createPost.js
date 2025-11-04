"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePost = void 0;
class CreatePost {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(post) {
        return await this.postRepository.create(post);
    }
}
exports.CreatePost = CreatePost;

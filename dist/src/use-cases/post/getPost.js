"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostById = void 0;
class GetPostById {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId) {
        return await this.postRepository.findById(postId);
    }
}
exports.GetPostById = GetPostById;

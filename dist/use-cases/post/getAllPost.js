"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPosts = void 0;
class GetAllPosts {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute() {
        return await this.postRepository.findAll();
    }
}
exports.GetAllPosts = GetAllPosts;

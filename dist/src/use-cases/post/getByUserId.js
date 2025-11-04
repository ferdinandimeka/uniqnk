"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByUserId = void 0;
class GetByUserId {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(userId) {
        return await this.postRepository.findByUserId(userId);
    }
}
exports.GetByUserId = GetByUserId;

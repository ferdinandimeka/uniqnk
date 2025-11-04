"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStoryById = void 0;
class GetStoryById {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(userId) {
        return await this.storyRepository.findById(userId);
    }
}
exports.GetStoryById = GetStoryById;

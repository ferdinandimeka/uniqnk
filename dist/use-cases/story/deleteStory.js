"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteStory = void 0;
class DeleteStory {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(userId) {
        await this.storyRepository.delete(userId);
    }
}
exports.DeleteStory = DeleteStory;

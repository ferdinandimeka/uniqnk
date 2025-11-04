"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteExpiredStories = void 0;
class DeleteExpiredStories {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute() {
        await this.storyRepository.deleteExpiredStories();
    }
}
exports.DeleteExpiredStories = DeleteExpiredStories;

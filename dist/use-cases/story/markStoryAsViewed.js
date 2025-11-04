"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkStoryAsViewed = void 0;
class MarkStoryAsViewed {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(storyId, userId) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.markStoryAsViewed(storyId, userId);
        return result;
    }
}
exports.MarkStoryAsViewed = MarkStoryAsViewed;

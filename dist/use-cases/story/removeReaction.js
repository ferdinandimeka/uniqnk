"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveReaction = void 0;
class RemoveReaction {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(storyId, userId) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.removeReaction(storyId, userId);
        return result;
    }
}
exports.RemoveReaction = RemoveReaction;

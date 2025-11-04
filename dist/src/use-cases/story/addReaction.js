"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReaction = void 0;
class AddReaction {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(storyId, userId, reactionType) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.addReaction(storyId, userId, reactionType);
        return result;
    }
}
exports.AddReaction = AddReaction;

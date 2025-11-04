"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveStories = void 0;
class GetActiveStories {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute() {
        // Call the signIn method with credentials
        const result = await this.storyRepository.getActiveStories();
        return result;
    }
}
exports.GetActiveStories = GetActiveStories;

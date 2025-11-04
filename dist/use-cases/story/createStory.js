"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStory = void 0;
class CreateStory {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(story) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.create(story);
        return result;
    }
}
exports.CreateStory = CreateStory;

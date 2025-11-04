"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddViewer = void 0;
class AddViewer {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute(storyId, userId) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.addViewer(storyId, userId);
        return result;
    }
}
exports.AddViewer = AddViewer;

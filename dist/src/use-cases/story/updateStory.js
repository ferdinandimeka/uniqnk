"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStory = void 0;
const apiError_1 = require("../../utils/apiError");
class UpdateStory {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    // async execute(user: User) {
    //     return await this.storyRepository.update(user);
    // }
    async execute(storyId, storyData) {
        const story = await this.storyRepository.findById(storyId);
        if (!story) {
            throw new apiError_1.ApiError(404, "User not found");
        }
        const updatedStory = { ...story, ...storyData };
        await this.storyRepository.update(updatedStory);
        return updatedStory;
    }
}
exports.UpdateStory = UpdateStory;

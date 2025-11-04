"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllStories = void 0;
class GetAllStories {
    constructor(storyRepository) {
        this.storyRepository = storyRepository;
    }
    async execute() {
        return await this.storyRepository.findAll();
    }
}
exports.GetAllStories = GetAllStories;

import { StoryRepository } from "../../domain/interfaces/storyRepository";

export class GetAllStories {
    constructor(private storyRepository: StoryRepository) {}

    async execute() {
        return await this.storyRepository.findAll();
    }
}
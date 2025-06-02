import { StoryRepository } from "../../domain/interfaces/storyRepository";

export class GetStoryById {
    constructor(private storyRepository: StoryRepository) {}

    async execute(userId: string) {
        return await this.storyRepository.findById(userId);
    }
}
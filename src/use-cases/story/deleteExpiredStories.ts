import { StoryRepository } from "../../domain/interfaces/storyRepository";

export class DeleteExpiredStories {
    constructor(private storyRepository: StoryRepository) {}

    async execute(): Promise<void> {
        await this.storyRepository.deleteExpiredStories();
    }
}
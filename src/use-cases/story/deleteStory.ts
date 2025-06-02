import { StoryRepository } from "../../domain/interfaces/storyRepository";

export class DeleteStory {
    constructor(private storyRepository: StoryRepository) {}

    async execute(userId: string): Promise<void> {
        await this.storyRepository.delete(userId);
    }
}
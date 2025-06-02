import { StoryRepository } from './../../domain/interfaces/storyRepository';
import { Story } from "../../domain/entities/Story";

export class MarkStoryAsViewed {
    constructor(private storyRepository: StoryRepository) {}

    async execute(storyId: string, userId: string) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.markStoryAsViewed(storyId, userId);

        return result;
    }
}
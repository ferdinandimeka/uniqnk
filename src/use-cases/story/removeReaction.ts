import { StoryRepository } from './../../domain/interfaces/storyRepository';
import { Story } from "../../domain/entities/Story";

export class RemoveReaction {
    constructor(private storyRepository: StoryRepository) {}

    async execute(storyId: string, userId: string) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.removeReaction(storyId, userId);

        return result;
    }
}
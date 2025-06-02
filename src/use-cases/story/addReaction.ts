import { StoryRepository } from './../../domain/interfaces/storyRepository';
import { Story } from "../../domain/entities/Story";

export class AddReaction {
    constructor(private storyRepository: StoryRepository) {}

    async execute(storyId: string, userId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry") {
        // Call the signIn method with credentials
        const result = await this.storyRepository.addReaction(storyId, userId, reactionType);

        return result;
    }
}
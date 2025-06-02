import { StoryRepository } from '../../domain/interfaces/storyRepository';
import { Story } from "../../domain/entities/Story";

export class GetActiveStories {
    constructor(private storyRepository: StoryRepository) {}

    async execute() {
        // Call the signIn method with credentials
        const result = await this.storyRepository.getActiveStories();

        return result;
    }
}
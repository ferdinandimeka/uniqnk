import { StoryRepository } from './../../domain/interfaces/storyRepository';
import { Story } from "../../domain/entities/Story";

export class CreateStory {
    constructor(private storyRepository: StoryRepository) {}

    async execute(story: Story) {
        // Call the signIn method with credentials
        const result = await this.storyRepository.create(story);

        return result;
    }
}

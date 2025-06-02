import { StoryRepository } from "../../domain/interfaces/storyRepository";
import { Story } from "../../domain/entities/Story";
import { ApiError } from "../../utils/apiError";

export class UpdateStory {
    constructor(private storyRepository: StoryRepository) {}

    // async execute(user: User) {
    //     return await this.storyRepository.update(user);
    // }

   async execute(storyId: string, storyData: Partial<Story>) {
        const story = await this.storyRepository.findById(storyId);
        if (!story) {
            throw new ApiError(404, "User not found");
        }

        const updatedStory = { ...story, ...storyData };
        await this.storyRepository.update(updatedStory);
        return updatedStory;
   }
}
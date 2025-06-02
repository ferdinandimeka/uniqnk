import { Story } from "../entities/Story";

export interface StoryRepository {
    findAll(): Promise<Story[]>;
    findById(id: string): Promise<Story | null>;
    findByUserId(userId: string): Promise<Story[]>;
    create(story: Story): Promise<Story>;
    update(story: Story): Promise<void>;
    delete(id: string): Promise<void>;
    deleteExpiredStories(): Promise<void>;
    addReaction(storyId: string, userId: string, reactionType: string): Promise<Story | null>
    removeReaction(storyId: string, userId: string): Promise<Story | null>
    addViewer(storyId: string, userId: string): Promise<Story | null>
    getActiveStories(): Promise<Story[]>;
    markStoryAsViewed(storyId: string, userId: string): Promise<Story | null>
}

import { StoryRepository } from "../../domain/interfaces/storyRepository";
import { ApiError } from "../../utils/apiError";
import { StoryModel } from "../models/StoryModel";
import { Story } from "../../domain/entities/Story";
import { StoryViewModel } from "../models/StoryViewModel";
import mongoose from "mongoose";

export class MongoStoryRepository implements StoryRepository {
    
    async findAll(): Promise<any[]> {
        const stories = await StoryModel.find();
        return stories.map((story) => this.toStory(story));
    }

    async findById(id: string): Promise<any | null> {
        const story = await StoryModel.findById(id);
        if (!story) {
            throw new ApiError(404, "Story not found");
        }
        return this.toStory(story);
    }

    async findByUserId(userId: string): Promise<any[]> {
        return StoryModel.find({ userId });
    }
    
    async create(story: any): Promise<any> {
        const newStory = new StoryModel(story);
        const stories = await newStory.save();
        return this.toStory(stories);
    }

    async update(story: any): Promise<void> {
        const updatedStory = await StoryModel.findByIdAndUpdate(story.id, story, { new: true });
        if (!updatedStory) {
            throw new ApiError(404, "Story not found");
        }
        await updatedStory.save();
    }

    async delete(id: string): Promise<void> {
        const deletedStory = await StoryModel.findByIdAndDelete(id);
        if (!deletedStory) {
            throw new ApiError(404, "Story not found");
        }
    }

    async deleteExpiredStories(): Promise<void> {
        const currentDate = new Date();
        await StoryModel.deleteMany({ expirationDate: { $lt: currentDate } });
    }

    async addReaction(storyId: string, userId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry"): Promise<any | null> {
        const story = await StoryModel.findById(storyId);
        if (!story) {
            throw new ApiError(404, "Story not found");
        }
        if (!story.reactions) {
            story.reactions = [];
        }
        const existingReaction = story.reactions.find((reaction: any) => reaction.user.toString() === userId);
        if (existingReaction) {
            existingReaction.type = reactionType;
        } else {
            story.reactions.push({
                user: new mongoose.Types.ObjectId(userId), type: reactionType,
                timestamp: new Date(),
            });
        }
        await story.save();
        return this.toStory(story);
    }

    async removeReaction(storyId: string, userId: string): Promise<any | null> {
        const story = await StoryModel.findById(storyId);
        if (!story) {
            throw new ApiError(404, "Story not found");
        }
        if (!story.reactions) {
            story.reactions = [];
        }
        const reactionIndex = story.reactions.findIndex((reaction: any) => reaction.user.toString() === userId);
        if (reactionIndex !== -1) {
            story.reactions.splice(reactionIndex, 1);
        }
        await story.save();
        return this.toStory(story);
    }

    async addViewer(storyId: string, userId: string): Promise<any | null> {
        const story = await StoryModel.findById(storyId);
        if (!story) {
            throw new ApiError(404, "Story not found");
        }
        if (!story.viewers) {
            story.viewers = [];
        }
        const existingViewer = story.viewers.find((viewer: any) => viewer.toString() === userId);
        if (!existingViewer) {
            story.viewers.push(new mongoose.Types.ObjectId(userId));
        }
        await story.save();
        return this.toStory(story);
    }

    async getActiveStories(): Promise<any[]> {
        // retreive stories that have not expired
        const currentDate = new Date();
        const stories = await StoryModel.find({ expiresAt: { $gt: currentDate } });
        return stories.map((story) => this.toStory(story));
    }
    
    async markStoryAsViewed(storyId: string, userId: string): Promise<any | null> {
        const story = await StoryModel.findById(storyId);
        if (!story) {
            throw new ApiError(404, "Story not found");
        }

        // Check if the user has already viewed the story
        const existingView = await StoryViewModel.findOne({
            story: storyId,
            user: userId
        });

        if (!existingView) {
            // Create a new view record
            const newView = new StoryViewModel({
                story: storyId,
                user: userId,
                viewedAt: new Date()
            });
            await newView.save();
        }
    }

    private toStory(storyDoc: any): Story {
        const userObj = storyDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
